import { Prisma } from '@prisma/client'
import { prisma } from './prisma'
import { generateEmbedding } from './embedding'
import { createOllama } from './ollama'

export interface SearchResult {
  chunkId: string
  content: string
  documentId: string
  documentTitle: string
  score: number
  startChar: number
  endChar: number
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ConverseInput {
  messages: ChatMessage[]
  userId?: string
  limit?: number
}

function getConfig() {
  const config = useRuntimeConfig()
  return {
    ollamaUrl: config.ollamaUrl as string,
    ollamaApiKey: config.ollamaApiKey as string,
    ollamaLlmModel: config.ollamaLlmModel as string,
    ollamaChatTimeoutMs: Number(config.ollamaChatTimeoutMs ?? 180_000),
    memoryScope: config.memoryScope as string,
  }
}

export async function search(query: string, limit = 5, userId?: string): Promise<SearchResult[]> {
  const queryEmbedding = await generateEmbedding(query)
  const embeddingString = `[${queryEmbedding.join(',')}]`

  const cfg = getConfig()
  const memoryScope = (cfg.memoryScope || 'local_per_user').trim()
  const conditions: Prisma.Sql[] = []

  if (memoryScope === 'local_per_user' && userId?.trim()) {
    conditions.push(Prisma.sql`(d."userId" = ${userId.trim()} OR d."userId" IS NULL)`)
  }
  if (memoryScope === 'disabled') {
    conditions.push(Prisma.sql`(d.metadata->>'kind' IS NULL OR d.metadata->>'kind' <> 'chat_memory')`)
  }

  const where = conditions.length
    ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
    : Prisma.sql``

  const results = await prisma.$queryRaw`
    SELECT
      c.id as "chunkId",
      c.content,
      c."documentId",
      d.title as "documentTitle",
      c."startChar",
      c."endChar",
      c.embedding <=> ${embeddingString}::vector as score
    FROM "Chunk" c
    JOIN "Document" d ON c."documentId" = d.id
    ${where}
    ORDER BY score ASC
    LIMIT ${limit}
  `

  return (results as Array<Record<string, unknown>>).map((r) => ({
    chunkId: r.chunkId as string,
    content: r.content as string,
    documentId: r.documentId as string,
    documentTitle: r.documentTitle as string,
    score: 1 - parseFloat(String(r.score)),
    startChar: (r.startChar as number) || 0,
    endChar: (r.endChar as number) || 0,
  }))
}

export async function rag(query: string, limit = 5, userId?: string) {
  const results = await search(query, limit, userId)
  const context = results.map((r, i) => `[${i + 1}] ${r.content}`).join('\n\n')
  const sources = [
    ...new Map(
      results.map((r) => [r.documentId, { title: r.documentTitle, id: r.documentId }]),
    ).values(),
  ]
  return { query, results, context, sources }
}

export async function inspect(query: string, limit = 5) {
  const t0 = Date.now()
  const queryEmbedding = await generateEmbedding(query)
  const tEmbed = Date.now()
  const embeddingString = `[${queryEmbedding.join(',')}]`

  const rows = await prisma.$queryRaw`
    SELECT
      c.id as "chunkId",
      c.content,
      c."documentId",
      d.title as "documentTitle",
      c."startChar",
      c."endChar",
      c.embedding <=> ${embeddingString}::vector as score
    FROM "Chunk" c
    JOIN "Document" d ON c."documentId" = d.id
    ORDER BY score ASC
    LIMIT ${limit}
  `
  const tRetrieve = Date.now()

  const results: SearchResult[] = (rows as Array<Record<string, unknown>>).map((r) => ({
    chunkId: r.chunkId as string,
    content: r.content as string,
    documentId: r.documentId as string,
    documentTitle: r.documentTitle as string,
    score: 1 - parseFloat(String(r.score)),
    startChar: (r.startChar as number) || 0,
    endChar: (r.endChar as number) || 0,
  }))

  const context = results.map((r, i) => `[${i + 1}] ${r.content}`).join('\n\n')
  const sources = [
    ...new Map(
      results.map((r) => [r.documentId, { title: r.documentTitle, id: r.documentId }]),
    ).values(),
  ]

  const systemPrompt = `You are a helpful assistant for the user's document knowledge base.
Use ONLY the CONTEXT below to answer. If the context is empty or does not contain the answer, say clearly that the information was not found in their documents.
Be concise. Match the language of the user's last message.

CONTEXT:
${context || '(no matching passages found)'}`

  return {
    query,
    embedding: { dimensions: queryEmbedding.length, preview: queryEmbedding.slice(0, 12) },
    results,
    context,
    sources,
    systemPrompt,
    latencyMs: { embed: tEmbed - t0, retrieve: tRetrieve - tEmbed, total: tRetrieve - t0 },
  }
}

export async function generateChatReply(
  systemPrompt: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  timeoutMs?: number,
): Promise<string> {
  const cfg = getConfig()
  const ms = Math.max(30_000, timeoutMs ?? cfg.ollamaChatTimeoutMs)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  const ollama = createOllama(cfg.ollamaUrl, cfg.ollamaApiKey || undefined, controller.signal)

  try {
    const baseMessages = [{ role: 'system' as const, content: systemPrompt }, ...history]
    const chat = await ollama.chat({
      model: cfg.ollamaLlmModel,
      messages: baseMessages,
      options: { num_predict: 384 },
    })
    const first = chat.message?.content?.trim()
    if (first) return first

    const retry = await ollama.chat({
      model: cfg.ollamaLlmModel,
      messages: [
        ...baseMessages,
        { role: 'user' as const, content: 'Respond with at least one concise sentence. If context is insufficient, say so clearly.' },
      ],
      options: { num_predict: 256 },
    })
    const second = retry.message?.content?.trim()
    if (second) return second

    return 'No pude generar una respuesta en este intento. Intenta de nuevo.'
  } catch (err: unknown) {
    const e = err as Error & { name?: string }
    if (e?.name === 'AbortError') {
      throw createError({
        statusCode: 503,
        statusMessage: `The model took longer than ${Math.round(ms / 1000)}s (timeout). Increase OLLAMA_CHAT_TIMEOUT_MS or use a smaller/faster model.`,
      })
    }
    throw createError({
      statusCode: 503,
      statusMessage: `Could not reach the language model (${cfg.ollamaLlmModel}). Is Ollama running and is the model pulled?`,
    })
  } finally {
    clearTimeout(timer)
  }
}

export async function logRagQuery(input: {
  queryText: string
  responseText: string | null
  results: SearchResult[]
  latencyMs: number
}): Promise<void> {
  try {
    const sources: Prisma.InputJsonValue = input.results.map((r) => ({
      chunkId: r.chunkId,
      documentId: r.documentId,
      documentTitle: r.documentTitle,
      score: r.score,
    }))
    await prisma.query.create({
      data: {
        queryText: input.queryText,
        responseText: input.responseText,
        sources,
        latencyMs: input.latencyMs,
      },
    })
  } catch {
    /* telemetry must not break user flow */
  }
}

export async function converse(input: ConverseInput) {
  const { messages, limit = 8 } = input
  if (!messages?.length) throw createError({ statusCode: 400, statusMessage: 'messages is required' })

  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  if (!lastUser?.content?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'At least one user message with content is required' })
  }

  const startedAt = Date.now()
  const queryText = lastUser.content.trim()
  const { context, sources, results } = await rag(queryText, limit, input.userId)

  const rawContext = context || '(no matching passages found)'
  const ctxBlock =
    rawContext.length > 20_000
      ? `${rawContext.slice(0, 20_000)}\n…[context truncated]`
      : rawContext

  const system = `You are a helpful assistant for the user's document knowledge base.
Use ONLY the CONTEXT below to answer. If the context is empty or does not contain the answer, say clearly that the information was not found in their documents.
Be concise. Match the language of the user's last message.

CONTEXT:
${ctxBlock}`

  const history = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  const reply = await generateChatReply(system, history)
  const finalReply = reply || '(empty response)'

  await logRagQuery({ queryText, responseText: finalReply, results, latencyMs: Date.now() - startedAt })

  return { reply: finalReply, sources, results }
}
