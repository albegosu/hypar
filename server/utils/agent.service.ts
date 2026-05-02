import { createOllama } from './ollama'
import { rag, generateChatReply, logRagQuery, type SearchResult, type ChatMessage } from './search.service'
import {
  createChatMemory,
  deleteChatMemories,
  chatMemoryExists,
} from './documents.service'

interface PlannerOutput {
  use_kb: boolean
  search_query: string | null
  direct_reply: string | null
}

export interface AgentChatInput {
  messages: ChatMessage[]
  userId?: string
  limit?: number
}

const PLANNER_SYSTEM = `You are a routing agent for a RAG application.
Return ONLY valid JSON (no markdown fences) with exactly these keys:
- "use_kb": boolean - true if a good answer needs facts from the user's uploaded documents (policies, internal notes, PDFs they indexed). false for greetings, thanks, small talk, or generic questions that do not depend on their files.
- "search_query": string or null - if use_kb is true, a short search query in the user's language to retrieve relevant passages; otherwise null.
- "direct_reply": string or null - if use_kb is false, a brief friendly reply in the user's language; otherwise null.

Examples:
{"use_kb":false,"search_query":null,"direct_reply":"Hi! Ask me anything about your uploaded documents."}
{"use_kb":true,"search_query":"refund policy deadlines","direct_reply":null}`

function getRuntimeCfg() {
  const config = useRuntimeConfig()
  return {
    ollamaUrl: config.ollamaUrl as string,
    ollamaApiKey: config.ollamaApiKey as string,
    ollamaLlmModel: config.ollamaLlmModel as string,
    ollamaPlannerTimeoutMs: Number(config.ollamaPlannerTimeoutMs ?? 60_000),
    memoryScope: (config.memoryScope as string) || 'local_per_user',
    memoryProactive: config.memoryProactive as boolean,
  }
}

export async function agentChat(input: AgentChatInput) {
  const { messages, limit = 8 } = input
  if (!messages?.length) throw createError({ statusCode: 400, statusMessage: 'messages is required' })

  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  if (!lastUser?.content?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'At least one user message with content is required' })
  }

  const history = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  const startedAt = Date.now()
  const queryText = lastUser.content.trim()
  const userId = input.userId?.trim()
  const cfg = getRuntimeCfg()
  const memoryScope = cfg.memoryScope.trim()

  const memoryCommand = parseMemoryCommand(lastUser.content)
  if (memoryCommand && memoryScope !== 'disabled') {
    const reply = await runMemoryCommand({
      ...memoryCommand,
      userId,
      startedAt,
      queryText,
      limit,
      history,
    })
    return { reply, used_kb: false, search_query: null, sources: [], results: [] }
  }

  const proactivelySaved =
    memoryScope !== 'disabled' && cfg.memoryProactive
      ? await maybeSaveProactiveMemories(lastUser.content, userId)
      : []

  const memoryAck =
    proactivelySaved.length > 0
      ? `\n\n(Guardé en tu memoria local: ${proactivelySaved.join(', ')})`
      : ''

  if (proactivelySaved.length > 0) {
    const looksLikeQuestion =
      /(\?|¿|como\b|cómo\b|que\b|qué\b|cu[aá]l\b|d[oó]nde\b|cu[aá]ndo\b|por que\b|necesito\b|dime\b|explica)/i.test(
        lastUser.content.toLowerCase(),
      )
    if (!looksLikeQuestion) {
      const reply = `Listo.${memoryAck}`
      await logRagQuery({ queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt })
      return { reply, used_kb: false, search_query: null, sources: [], results: [] }
    }
  }

  const tail = history.slice(-8)
  const plan = await runPlanner(JSON.stringify(tail), cfg)

  if (!plan.use_kb && plan.direct_reply?.trim()) {
    const reply = plan.direct_reply.trim()
    await logRagQuery({ queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt })
    return { reply: reply + memoryAck, used_kb: false, search_query: null, sources: [], results: [] }
  }

  const searchQuery = plan.search_query?.trim() || queryText
  const { context, sources, results } = await rag(searchQuery, limit, userId)

  if (!results.length) {
    const reply =
      'No encontré esa información en tus documentos ni en tu memoria local. ' +
      'Si quieres que la recuerde, usa `/remember <texto>`.' +
      memoryAck
    await logRagQuery({ queryText, responseText: reply, results, latencyMs: Date.now() - startedAt })
    return { reply, used_kb: false, search_query: searchQuery, sources: [], results: [] }
  }

  const rawContext = context || '(no matching passages found)'
  const ctxBlock =
    rawContext.length > 20_000 ? `${rawContext.slice(0, 20_000)}\n…[context truncated]` : rawContext

  const system = `You are a helpful assistant for the user's document knowledge base.
Use ONLY the CONTEXT below to answer. If the context is empty or does not contain the answer, say clearly that the information was not found in their documents.
Be concise. Match the language of the user's last message.

CONTEXT:
${ctxBlock}`

  const reply = await generateChatReply(system, history)
  const finalReply = (reply || '(empty response)') + memoryAck

  await logRagQuery({ queryText, responseText: finalReply, results, latencyMs: Date.now() - startedAt })
  return { reply: finalReply, used_kb: true, search_query: searchQuery, sources, results }
}

async function maybeSaveProactiveMemories(userText: string, userId?: string): Promise<string[]> {
  const trimmed = userText.trim()
  if (!trimmed || trimmed.startsWith('/') || /[?¿]/.test(trimmed) || trimmed.length > 220) return []

  const lower = trimmed.toLowerCase()
  if (/^(hola|buenas|hey)\b/.test(lower)) return []
  if (/\b(gracias|thx|muchas gracias)\b/.test(lower)) return []

  const normalized = trimmed.replace(/\s+/g, ' ')
  const candidates: string[] = []

  const addCandidate = (label: string, value: string) => {
    const v = value.trim().replace(/\s+/g, ' ')
    if (!v) return
    const text = `${label}: ${v}`
    candidates.push(text.length > 160 ? `${text.slice(0, 160)}…` : text)
  }

  const mColor = normalized.match(/^(?:mi\s+)?color\s*(?:es|=|:)\s*(.+)$/i)
  if (mColor?.[1]) addCandidate('color', mColor[1])
  const mName = normalized.match(/^(?:mi\s+nombre\s+es|me\s+llamo|se\s+llama)\s+(.+)$/i)
  if (mName?.[1]) addCandidate('nombre', mName[1])
  const mPref = normalized.match(/^(?:prefiero|me\s+gustaría?)\s+(.+)$/i)
  if (mPref?.[1]) addCandidate('preferencia', mPref[1])
  const mLikes = normalized.match(/^me\s+gusta\s+(.+)$/i)
  if (mLikes?.[1]) addCandidate('me gusta', mLikes[1])
  const mSoy = normalized.match(/^soy\s+(.+)$/i)
  if (mSoy?.[1]) addCandidate('soy', mSoy[1])

  if (candidates.length === 0) return []

  const unique = Array.from(new Set(candidates)).slice(0, 2)
  const saved: string[] = []
  for (const c of unique) {
    const exists = await chatMemoryExists(userId, c)
    if (exists) continue
    const doc = await createChatMemory(userId, c)
    if (doc) saved.push(c)
  }
  return saved
}

type MemoryCommand =
  | { type: 'help' }
  | { type: 'remember'; content: string }
  | { type: 'forget'; term?: string }
  | { type: 'clear' }

function parseMemoryCommand(text: string): MemoryCommand | null {
  const t = text.trim()
  if (!t) return null
  if (/^\/memory\s+clear(?:\s+|$)$/i.test(t)) return { type: 'clear' }
  if (/^\/(?:help|memory)(?:\s+|$)$/i.test(t)) return { type: 'help' }

  const rememberCmd = t.match(/^\/remember\s+([\s\S]+)$/i)
  if (rememberCmd) {
    const content = rememberCmd[1].trim()
    return content ? { type: 'remember', content } : null
  }

  const forgetCmd = t.match(/^\/forget(?:\s+([\s\S]+))?$/i)
  if (forgetCmd) {
    const term = forgetCmd[1]?.trim()
    return term ? { type: 'forget', term } : { type: 'clear' }
  }

  const rememberNl = t.match(/^(?:recuerda|guarda)\b[\s:]+([\s\S]+)$/i)
  if (rememberNl) {
    const content = rememberNl[1].replace(/^que\s+/i, '').trim()
    return content ? { type: 'remember', content } : null
  }

  return null
}

async function runMemoryCommand(
  cmd: MemoryCommand & { userId?: string; startedAt: number; queryText: string; limit: number; history: unknown[] },
): Promise<string> {
  const { type, userId, startedAt, queryText } = cmd

  if (type === 'help') {
    const reply =
      'Comandos:\n' +
      '- `/remember <texto>`: guarda un dato en tu memoria.\n' +
      '- `/forget <texto>`: borra memorias que coincidan (por fragmento).\n' +
      '- `/forget` o `/memory clear`: limpia tu memoria local.\n'
    await logRagQuery({ queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt })
    return reply
  }

  if (type === 'remember') {
    const content = (cmd as { type: 'remember'; content: string }).content
    if (!content?.trim()) return 'No encontré ningún texto para guardar. Usa `/remember <texto>`.'
    const doc = await createChatMemory(userId, content)
    const reply = doc ? 'Listo. Lo guardé en tu memoria local.' : 'No se guardó nada (texto vacío).'
    await logRagQuery({ queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt })
    return reply
  }

  if (type === 'forget') {
    const term = (cmd as { type: 'forget'; term?: string }).term
    const deleted = await deleteChatMemories(userId, term)
    const reply = `Ok. Eliminé memorias locales que coinciden con "${term}". (filas: ${deleted})`
    await logRagQuery({ queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt })
    return reply
  }

  // clear
  const deleted = await deleteChatMemories(userId, undefined)
  const reply = `Ok. Borré tu memoria local. (filas: ${deleted})`
  await logRagQuery({ queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt })
  return reply
}

async function runPlanner(tailJson: string, cfg: ReturnType<typeof getRuntimeCfg>): Promise<PlannerOutput> {
  const plannerTimeout = Math.max(30_000, cfg.ollamaPlannerTimeoutMs)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), plannerTimeout)
  const ollama = createOllama(cfg.ollamaUrl, cfg.ollamaApiKey || undefined, controller.signal)

  try {
    const chat = await ollama.chat({
      model: cfg.ollamaLlmModel,
      messages: [
        { role: 'system', content: PLANNER_SYSTEM },
        { role: 'user', content: `Conversation (last turns, JSON array of {role,content}):\n${tailJson}` },
      ],
      format: 'json',
      options: { num_predict: 220 },
    })
    const raw = chat.message?.content?.trim() || '{}'
    let parsed: Partial<PlannerOutput>
    try {
      parsed = JSON.parse(raw) as Partial<PlannerOutput>
    } catch {
      return { use_kb: true, search_query: null, direct_reply: null }
    }

    const search_query = typeof parsed.search_query === 'string' ? parsed.search_query : null
    const direct_reply = typeof parsed.direct_reply === 'string' ? parsed.direct_reply : null
    let use_kb: boolean
    if (typeof parsed.use_kb === 'boolean') {
      use_kb = parsed.use_kb
    } else if (direct_reply?.trim() && !search_query?.trim()) {
      use_kb = false
    } else {
      use_kb = true
    }

    if (use_kb && !search_query?.trim()) return { use_kb: true, search_query: null, direct_reply: null }
    if (!use_kb && !direct_reply?.trim()) {
      if (search_query?.trim()) return { use_kb: true, search_query, direct_reply: null }
      return { use_kb: false, search_query: null, direct_reply: 'How can I help you?' }
    }
    return { use_kb, search_query, direct_reply }
  } catch {
    return { use_kb: true, search_query: null, direct_reply: null }
  } finally {
    clearTimeout(timer)
  }
}
