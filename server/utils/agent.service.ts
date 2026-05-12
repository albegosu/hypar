import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  tool,
  type StreamTextResult,
  type UIMessage,
  type ToolSet,
  type LanguageModel,
} from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createMistral } from '@ai-sdk/mistral'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import { normalizeOllamaNativeHost } from './ollama'
import { resolveModelOverride } from './llm-models'
import { rag, search, logRagQuery, type SearchResult } from './search.service'
import { getSetting, getNumericSetting, getBoolSetting } from './settings.service.ts'
import {
  createChatMemory,
  deleteChatMemories,
  listChatMemories,
} from './documents.service'
import { truncate } from './text'
import { parseMemoryCommand, getMessageText, type MemoryCommand } from './agent-commands'

function getLlmCfg() {
  const config = useRuntimeConfig()
  return {
    llmProvider: (config.llmProvider as string) || '',
    ollamaUrl: config.ollamaUrl as string,
    ollamaApiKey: config.ollamaApiKey as string,
    ollamaLlmModel: config.ollamaLlmModel as string,
    openaiApiKey: config.openaiApiKey as string,
    openaiLlmModel: (config.openaiLlmModel as string) || 'gpt-4.1-mini',
    anthropicApiKey: config.anthropicApiKey as string,
    anthropicModel: (config.anthropicModel as string) || 'claude-sonnet-4-6',
    mistralApiKey: config.mistralApiKey as string,
    mistralModel: (config.mistralModel as string) || 'mistral-medium-latest',
    googleApiKey: config.googleApiKey as string,
    googleLlmModel: (config.googleLlmModel as string) || 'gemini-2.5-flash',
    memoryScope: (config.memoryScope as string) || 'local_per_user',
  }
}

async function getRagCfg() {
  const config = useRuntimeConfig()
  const [tempStr, citationsStr, maxCtxStr, langStr, promptStr] = await Promise.all([
    getSetting('RAG_TEMPERATURE', String(config.ragTemperature ?? 0.3)),
    getSetting('RAG_CITATIONS', String(config.ragCitations ?? true)),
    getSetting('RAG_MAX_CONTEXT', String(config.ragMaxContext ?? 4096)),
    getSetting('RAG_RESPONSE_LANG', String(config.ragResponseLang ?? 'auto')),
    getSetting('RAG_SYSTEM_PROMPT', String(config.ragSystemPrompt ?? '')),
  ])
  return {
    ragTemperature: getNumericSetting(tempStr, 0.3),
    ragCitations: getBoolSetting(citationsStr, true),
    ragMaxContext: Math.max(512, getNumericSetting(maxCtxStr, 4096)),
    ragResponseLang: langStr || 'auto',
    ragSystemPrompt: promptStr,
  }
}

export function getLlmModel(modelOverride?: string): LanguageModel {
  const cfg = getLlmCfg()

  // Explicit provider via LLM_PROVIDER env var; fall back to API key presence
  const provider = cfg.llmProvider
    || (cfg.anthropicApiKey ? 'anthropic' : '')
    || (cfg.mistralApiKey ? 'mistral' : '')
    || (cfg.openaiApiKey ? 'openai' : '')
    || (cfg.googleApiKey ? 'gemini' : '')
    || 'ollama'

  const resolved = resolveModelOverride(provider, modelOverride)

  if (provider === 'gemini') {
    const google = createGoogleGenerativeAI({ apiKey: cfg.googleApiKey })
    return google(resolved ?? cfg.googleLlmModel)
  }

  if (provider === 'anthropic') {
    const anthropic = createAnthropic({ apiKey: cfg.anthropicApiKey })
    return anthropic(resolved ?? cfg.anthropicModel)
  }

  if (provider === 'openai') {
    const openai = createOpenAI({ apiKey: cfg.openaiApiKey })
    return openai.chat(resolved ?? cfg.openaiLlmModel)
  }

  if (provider === 'mistral') {
    const mistral = createMistral({ apiKey: cfg.mistralApiKey })
    return mistral(resolved ?? cfg.mistralModel)
  }

  // ollama-cloud, ollama-local, or default
  const baseURL = normalizeOllamaNativeHost(cfg.ollamaUrl).replace(/\/+$/, '') + '/v1'
  const ollama = createOpenAI({
    apiKey: cfg.ollamaApiKey || 'ollama',
    baseURL,
    name: 'ollama',
  })
  return ollama.chat(resolved ?? cfg.ollamaLlmModel)
}

/**
 * Tool factory whose execute() side-effects into `bucket` so the chat handler
 * can persist the actual chunks the model retrieved (for citations + audit).
 */
function buildKbTools(
  userId: string | undefined,
  limit: number,
  bucket: SearchResult[],
  hydeModel: LanguageModel | undefined,
  ragCfg: Awaited<ReturnType<typeof getRagCfg>>,
): ToolSet {
  const cfg = ragCfg
  return {
    searchKnowledgeBase: tool({
      description:
        "Search the user's uploaded documents and personal memory for relevant passages. " +
        "Call this whenever the answer might depend on the user's files, notes, or remembered facts. " +
        'Cite results with [1], [2], … in the order returned.',
      inputSchema: z.object({
        query: z.string().min(1).describe("Short search query in the user's language"),
      }),
      execute: async ({ query }) => {
        const safeQuery = truncate(query.trim(), 512)
        const t0 = Date.now()
        const { results, sources, context } = await rag(safeQuery, limit, userId, hydeModel)
        const latencyMs = Date.now() - t0
        for (const r of results) bucket.push(r)
        const truncatedContext = truncate(context || '(no matching passages found)', cfg.ragMaxContext)
        return {
          context: truncatedContext,
          sources: cfg.ragCitations ? sources : [],
          results,
          count: results.length,
          latencyMs,
        }
      },
    }),
  }
}

export type SearchMode = 'auto' | 'search' | 'direct'

export interface AgentStreamInput {
  messages: UIMessage[]
  userId?: string
  limit?: number
  /** Chunks the model retrieved during this turn are pushed here. */
  retrievedChunks: SearchResult[]
  modelOverride?: string
  searchMode?: SearchMode
}

export async function agentStreamText(
  input: AgentStreamInput,
): Promise<StreamTextResult<ToolSet, never>> {
  const { messages, userId, retrievedChunks } = input
  const limit = input.limit ?? 8
  const searchMode = input.searchMode ?? 'auto'
  const cfg = await getRagCfg()

  const defaultSystem = `You are a helpful assistant for a personal RAG application.
- Identity: You are only this app's RAG helper over the user's own documents and memories. Do not say you are Claude, ChatGPT, Gemini, Copilot, or any other vendor product, and do not claim you were created by Anthropic, OpenAI, Google, etc. If asked who you are or which model you are, answer briefly that you are the local assistant for this knowledge base and that you do not expose vendor or SDK branding; if you truly do not know the underlying weights, say so briefly instead of inventing a name.
- The user has uploaded documents and may have stored personal memories.
- When the user asks anything that could depend on their documents, notes, or remembered facts, call the searchKnowledgeBase tool with a concise query in their language.
- For greetings, thanks, or generic small talk you do NOT need to search — answer directly.
- After EVERY tool call you MUST write at least one short paragraph in natural language for the user. Never finish your turn with only a tool invocation: always follow with a visible answer grounded in the tool's returned context. Cite using [1], [2], … matching the order of the passages. If the context is empty, say clearly that nothing relevant was found.
- Be concise. Match the language of the user's last message.`

  const directSystem = `You are a helpful assistant. Answer directly from your own knowledge without searching any documents.
- Be concise. Match the language of the user's last message.`

  const searchSystem = `You are a helpful assistant for a personal RAG application.
- Identity: You are only this app's RAG helper over the user's own documents and memories. Do not say you are Claude, ChatGPT, Gemini, Copilot, or any other vendor product.
- You MUST always call the searchKnowledgeBase tool before answering, regardless of the question.
- After the tool call you MUST write at least one paragraph grounded in the returned context. Cite using [1], [2], … If the context is empty, say clearly that nothing relevant was found.
- Be concise. Match the language of the user's last message.`

  let system: string
  if (searchMode === 'direct') system = directSystem
  else if (searchMode === 'search') system = cfg.ragSystemPrompt || searchSystem
  else system = cfg.ragSystemPrompt || defaultSystem

  if (searchMode !== 'direct') {
    if (cfg.ragResponseLang === 'es') system += '\n- Responde siempre en español.'
    else if (cfg.ragResponseLang === 'en') system += '\n- Respond always in English.'
  }

  const validMessages = messages.filter((m) => {
    if (m.role !== 'assistant') return true
    const textParts = (m.parts ?? []).filter(
      (p): p is { type: 'text'; text: string } => p.type === 'text',
    )
    const hasText = textParts.some((p) => p.text.trim().length > 0)
    const hasCompletedTool = (m.parts ?? []).some((p) => {
      if (!p.type.startsWith('tool-')) return false
      const state = (p as { state?: string }).state
      return (
        state === 'output-available' ||
        state === 'output-error' ||
        state === 'output-denied' ||
        state === 'output'
      )
    })
    return hasText || hasCompletedTool
  })

  const modelMessages = await convertToModelMessages(validMessages)
  const model = getLlmModel(input.modelOverride)

  return streamText({
    model,
    system,
    messages: modelMessages,
    ...(searchMode !== 'direct' && {
      tools: buildKbTools(userId, limit, retrievedChunks, model, cfg),
      stopWhen: stepCountIs(5),
      ...(searchMode === 'search' && { toolChoice: 'required' }),
    }),
    temperature: cfg.ragTemperature,
    onError: ({ error }) => {
      console.error('[agent] streamText error:', error)
    },
  })
}

export async function runMemoryCommand(
  cmd: MemoryCommand & {
    userId?: string
    startedAt: number
    queryText: string
    limit: number
    history: unknown[]
    conversationId?: string
  },
): Promise<string> {
  const { type, userId, startedAt, queryText, conversationId } = cmd

  if (type === 'list') {
    const items = await listChatMemories(userId)
    const reply = items.length
      ? `Memoria local (${items.length}):\n${items.map((m, i) => `${i + 1}. ${m}`).join('\n')}`
      : 'No tienes nada guardado en memoria local.'
    await logRagQuery({
      queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt,
      userId, conversationId, toolCalled: false,
    })
    return reply
  }

  if (type === 'search') {
    const query = (cmd as { type: 'search'; query: string }).query
    const results = await search(query, { userId, limit: cmd.limit ?? 5 })
    const reply = results.length
      ? `Resultados para "${query}":\n\n${results.map((r, i) =>
          `**${i + 1}. ${r.documentTitle}** (score: ${r.score.toFixed(2)})\n${r.content.slice(0, 300)}…`
        ).join('\n\n')}`
      : `No encontré resultados para "${query}".`
    await logRagQuery({
      queryText, responseText: reply, results, latencyMs: Date.now() - startedAt,
      userId, conversationId, toolCalled: true,
    })
    return reply
  }

  if (type === 'help') {
    const reply =
      'Comandos:\n' +
      '- `/remember <texto>`: guarda un dato en tu memoria.\n' +
      '- `/forget <texto>`: borra memorias que coincidan (por fragmento).\n' +
      '- `/forget` o `/memory clear`: limpia tu memoria local.\n' +
      '- `/list`: muestra tu memoria local.\n' +
      '- `/search <consulta>`: busca en tu base de conocimiento.\n' +
      '- `/new`: inicia una nueva conversación.\n'
    await logRagQuery({
      queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt,
      userId, conversationId, toolCalled: false,
    })
    return reply
  }

  if (type === 'remember') {
    const content = (cmd as { type: 'remember'; content: string }).content
    if (!content?.trim()) return 'No encontré ningún texto para guardar. Usa `/remember <texto>`.'
    const doc = await createChatMemory(userId, content)
    const reply = doc ? 'Listo. Lo guardé en tu memoria local.' : 'No se guardó nada (texto vacío).'
    await logRagQuery({
      queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt,
      userId, conversationId, toolCalled: false,
    })
    return reply
  }

  if (type === 'forget') {
    const term = (cmd as { type: 'forget'; term?: string }).term
    const deleted = await deleteChatMemories(userId, term)
    const reply = `Ok. Eliminé memorias locales que coinciden con "${term}". (filas: ${deleted})`
    await logRagQuery({
      queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt,
      userId, conversationId, toolCalled: false,
    })
    return reply
  }

  const deleted = await deleteChatMemories(userId, undefined)
  const reply = `Ok. Borré tu memoria local. (filas: ${deleted})`
  await logRagQuery({
    queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt,
    userId, conversationId, toolCalled: false,
  })
  return reply
}
