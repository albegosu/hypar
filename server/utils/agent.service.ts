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
import { normalizeOllamaNativeHost, resolveOllamaCloudHost } from './ollama'
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
import { sanitizeUIMessagesForAgent } from './agent-messages'

async function getLlmCfg() {
  const config = useRuntimeConfig()
  const [
    llmProvider,
    ollamaUrl,
    ollamaApiKey,
    ollamaLlmModel,
    openaiApiKey,
    openaiLlmModel,
    anthropicApiKey,
    anthropicModel,
    mistralApiKey,
    mistralModel,
    googleApiKey,
    googleLlmModel,
    memoryScope,
  ] = await Promise.all([
    getSetting('LLM_PROVIDER', String(config.llmProvider ?? '')),
    getSetting('OLLAMA_URL', String(config.ollamaUrl ?? '')),
    getSetting('OLLAMA_API_KEY', String(config.ollamaApiKey ?? '')),
    getSetting('OLLAMA_LLM_MODEL', String(config.ollamaLlmModel ?? '')),
    getSetting('OPENAI_API_KEY', String(config.openaiApiKey ?? '')),
    getSetting('OPENAI_LLM_MODEL', String(config.openaiLlmModel ?? 'gpt-4.1-mini')),
    getSetting('ANTHROPIC_API_KEY', String(config.anthropicApiKey ?? '')),
    getSetting('ANTHROPIC_MODEL', String(config.anthropicModel ?? 'claude-sonnet-4-6')),
    getSetting('MISTRAL_API_KEY', String(config.mistralApiKey ?? '')),
    getSetting('MISTRAL_MODEL', String(config.mistralModel ?? 'mistral-medium-latest')),
    getSetting('GOOGLE_API_KEY', String(config.googleApiKey ?? '')),
    getSetting('GOOGLE_LLM_MODEL', String(config.googleLlmModel ?? 'gemini-2.5-flash')),
    getSetting('MEMORY_SCOPE', String(config.memoryScope ?? 'local_per_user')),
  ])
  return {
    llmProvider,
    ollamaUrl,
    ollamaApiKey,
    ollamaLlmModel,
    openaiApiKey,
    openaiLlmModel,
    anthropicApiKey,
    anthropicModel,
    mistralApiKey,
    mistralModel,
    googleApiKey,
    googleLlmModel,
    memoryScope,
  }
}

async function getRagCfg() {
  const config = useRuntimeConfig()
  const [tempStr, citationsStr, maxCtxStr, langStr, promptStr, maxStepsStr] = await Promise.all([
    getSetting('RAG_TEMPERATURE', String(config.ragTemperature ?? 0.3)),
    getSetting('RAG_CITATIONS', String(config.ragCitations ?? true)),
    getSetting('RAG_MAX_CONTEXT', String(config.ragMaxContext ?? 4096)),
    getSetting('RAG_RESPONSE_LANG', String(config.ragResponseLang ?? 'auto')),
    getSetting('RAG_SYSTEM_PROMPT', String(config.ragSystemPrompt ?? '')),
    getSetting('AGENT_MAX_STEPS', String(config.agentMaxSteps ?? 5)),
  ])
  return {
    ragTemperature: getNumericSetting(tempStr, 0.3),
    ragCitations: getBoolSetting(citationsStr, true),
    ragMaxContext: Math.max(512, getNumericSetting(maxCtxStr, 4096)),
    ragResponseLang: langStr || 'auto',
    ragSystemPrompt: promptStr,
    agentMaxSteps: Math.max(1, Math.min(20, getNumericSetting(maxStepsStr, 5))),
  }
}

export async function getLlmModel(modelOverride?: string): Promise<LanguageModel> {
  const cfg = await getLlmCfg()

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
  // Guardrail: docker-compose often sets OLLAMA_URL=http://ollama:11434; cloud chat
  // must use https://ollama.com (api.ollama.com returns 401 on /v1/chat/completions).
  const ollamaHost = provider === 'ollama-cloud'
    ? resolveOllamaCloudHost(cfg.ollamaUrl)
    : cfg.ollamaUrl
  const baseURL = normalizeOllamaNativeHost(ollamaHost).replace(/\/+$/, '') + '/v1'
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
  workspaceId: string | undefined,
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
        const { results, sources, context } = await rag(safeQuery, limit, workspaceId, hydeModel)
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
  workspaceId?: string
  limit?: number
  /** Chunks the model retrieved during this turn are pushed here. */
  retrievedChunks: SearchResult[]
  modelOverride?: string
  searchMode?: SearchMode
}

export async function agentStreamText(
  input: AgentStreamInput,
): Promise<StreamTextResult<ToolSet, never>> {
  const { messages, workspaceId, retrievedChunks } = input
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
  else if (searchMode === 'search') system = searchSystem
  else system = defaultSystem

  // Custom RAG_SYSTEM_PROMPT is appended as extra guidance so the base
  // tool-call instructions are preserved in every mode.
  if (cfg.ragSystemPrompt?.trim()) {
    system += `\n\n# Additional instructions\n${cfg.ragSystemPrompt.trim()}`
  }

  if (searchMode !== 'direct') {
    if (cfg.ragResponseLang === 'es') system += '\n- Responde siempre en español.'
    else if (cfg.ragResponseLang === 'en') system += '\n- Respond always in English.'
  }

  const sanitizedMessages = sanitizeUIMessagesForAgent(messages)
  const modelMessages = await convertToModelMessages(sanitizedMessages)
  const model = await getLlmModel(input.modelOverride)

  return streamText({
    model,
    system,
    messages: modelMessages,
    ...(searchMode !== 'direct' && {
      tools: buildKbTools(workspaceId, limit, retrievedChunks, model, cfg),
      stopWhen: stepCountIs(cfg.agentMaxSteps),
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
    userId: string
    workspaceId: string
    startedAt: number
    queryText: string
    limit: number
    history: unknown[]
    conversationId?: string
  },
): Promise<string> {
  const { type, userId, workspaceId, startedAt, queryText, conversationId } = cmd

  if (type === 'list') {
    const items = await listChatMemories(workspaceId)
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
    const results = await search(query, { workspaceId, limit: cmd.limit ?? 5 })
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
    const doc = await createChatMemory(workspaceId, content)
    const reply = doc ? 'Listo. Lo guardé en tu memoria local.' : 'No se guardó nada (texto vacío).'
    await logRagQuery({
      queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt,
      userId, conversationId, toolCalled: false,
    })
    return reply
  }

  if (type === 'forget') {
    const term = (cmd as { type: 'forget'; term?: string }).term
    const deleted = await deleteChatMemories(workspaceId, term)
    const reply = `Ok. Eliminé memorias locales que coinciden con "${term}". (filas: ${deleted})`
    await logRagQuery({
      queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt,
      userId, conversationId, toolCalled: false,
    })
    return reply
  }

  const deleted = await deleteChatMemories(workspaceId, undefined)
  const reply = `Ok. Borré tu memoria local. (filas: ${deleted})`
  await logRagQuery({
    queryText, responseText: reply, results: [], latencyMs: Date.now() - startedAt,
    userId, conversationId, toolCalled: false,
  })
  return reply
}
