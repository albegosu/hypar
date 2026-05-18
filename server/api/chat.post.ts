import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  APICallError,
  type UIMessage,
} from 'ai'
import { z } from 'zod'
import { getMessageText, parseMemoryCommand } from '../utils/agent-commands'
import { agentStreamText, runMemoryCommand } from '../utils/agent.service'
import { enforceRateLimit } from '../utils/rate-limit'
import { logRagQuery, type SearchResult } from '../utils/search.service'
import {
  ensureConversation,
  appendUserMessage,
  appendAssistantMessage,
  refreshConversationTitleFromUserPrompt,
} from '../utils/conversations.service'
import { scheduleRefineConversationTitle } from '../utils/conversation-title-llm'
import {
  classifyLlmError,
  formatAppRateLimitMessage,
  formatProviderQuotaMessage,
} from '../utils/llm-errors'
import { markProviderQuotaHit } from '../utils/llm-quota-guard'

const MAX_MESSAGES = 50
const MAX_TEXT_PER_PART = 64 * 1024

/** Shown when the LLM runs RAG but streams no text (common with tiny local models). */
const EMPTY_REPLY_AFTER_RETRIEVAL =
  '_The model searched your documents but returned no reply text. Try sending again or use a larger chat model._'

// Permissive UIMessage shape — Vercel AI SDK ships many part types and we don't
// want to break on every new one. We validate the *envelope* and the text size,
// not every internal field.
const uiMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['user', 'assistant', 'system']),
  parts: z
    .array(z.object({ type: z.string() }).passthrough())
    .max(200),
}).passthrough()

const bodySchema = z.object({
  messages: z.array(uiMessageSchema).min(1).max(MAX_MESSAGES),
  userId: z.string().max(200).optional(),
  conversationId: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(20).optional(),
  model: z.string().max(200).optional(),
  searchMode: z.enum(['auto', 'search', 'direct']).optional(),
})

function classifyError(error: unknown): { statusCode: number; message: string } {
  const classified = classifyLlmError(error)
  switch (classified.kind) {
    case 'app_rate_limit':
      return { statusCode: 429, message: formatAppRateLimitMessage() }
    case 'provider_quota':
      return {
        statusCode: 429,
        message: formatProviderQuotaMessage(classified.retryAfterSeconds),
      }
    case 'unauthorized':
      return { statusCode: 401, message: 'Model API key is invalid or missing.' }
    case 'unreachable':
      return { statusCode: 503, message: 'Cannot reach the model. Is Ollama running?' }
    case 'model':
      if (APICallError.isInstance(error)) {
        const code = error.statusCode ?? 502
        if (code >= 500) {
          return { statusCode: 502, message: `Model provider returned ${code}. Try again later.` }
        }
        return { statusCode: code, message: error.message }
      }
      return { statusCode: classified.statusCode, message: classified.rawMessage || 'Model provider error.' }
    default:
      return {
        statusCode: classified.statusCode,
        message: classified.rawMessage || 'Unexpected model error.',
      }
  }
}

function validateMessageSize(messages: UIMessage[]): void {
  for (const m of messages) {
    for (const p of m.parts ?? []) {
      if (p.type === 'text') {
        const text = (p as { text?: string }).text ?? ''
        if (text.length > MAX_TEXT_PER_PART) {
          throw createError({ statusCode: 413, statusMessage: 'Message part too large' })
        }
      }
    }
  }
}

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)
  const messages = body.messages as UIMessage[]
  validateMessageSize(messages)

  const userId = requireSessionUserId(event)
  await enforceRateLimit(event)
  const workspaceId = event.context.workspaceId
  if (!workspaceId) throw createError({ statusCode: 400, statusMessage: 'No active workspace' })

  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  const lastUserText = lastUser ? getMessageText(lastUser) : ''
  if (!lastUserText) {
    throw createError({ statusCode: 400, statusMessage: 'Last user message is empty' })
  }

  // Resolve / create conversation up front. Memory commands also belong to a
  // conversation so the user can see the command + reply in their history.
  const convMeta = await ensureConversation(
    body.conversationId,
    workspaceId,
    lastUserText,
  )
  const conversationId = convMeta.id

  // ── Memory command short-circuit (no model call) ─────────────────────────
  // For commands we persist the user message right away — there's no remote
  // call that can fail and leave it orphaned.
  const memoryCmd = parseMemoryCommand(lastUserText)
  if (memoryCmd) {
    if (lastUser) {
      await appendUserMessage(conversationId, lastUser, lastUserText)
        .then(() => refreshConversationTitleFromUserPrompt(conversationId, lastUserText))
        .catch((err) => console.error('[chat] failed to persist user message:', err))
    }
    const startedAt = Date.now()
    const reply = await runMemoryCommand({
      ...memoryCmd,
      userId,
      workspaceId,
      startedAt,
      queryText: lastUserText,
      limit: body.limit ?? 8,
      history: [],
      conversationId,
    })

    await appendAssistantMessage(
      conversationId,
      reply,
      [{ type: 'text', text: reply }],
      [],
      null,
    )
      .then(() => {
        scheduleRefineConversationTitle(conversationId)
      })
      .catch((err) => console.error('[chat] failed to persist memory reply:', err))

    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const id = 'memcmd-' + Date.now()
        writer.write({ type: 'start' })
        writer.write({ type: 'text-start', id })
        writer.write({ type: 'text-delta', id, delta: reply })
        writer.write({ type: 'text-end', id })
        writer.write({ type: 'finish' })
      },
    })
    return createUIMessageStreamResponse({
      stream,
      headers: { 'x-conversation-id': conversationId },
    })
  }

  // ── Agent stream ─────────────────────────────────────────────────────────
  const startedAt = Date.now()
  const retrievedChunks: SearchResult[] = []

  let result: Awaited<ReturnType<typeof agentStreamText>>
  try {
    result = await agentStreamText({
      messages,
      workspaceId,
      limit: body.limit ?? 8,
      retrievedChunks,
      modelOverride: body.model,
      searchMode: body.searchMode,
    })
  } catch (error) {
    // Stream setup failed (e.g. bad API key, unreachable Ollama). The user
    // message has NOT been persisted yet, so there's no orphan to clean up.
    console.error('[chat] pre-stream error:', error)
    if (classifyLlmError(error).kind === 'provider_quota') markProviderQuotaHit(error)
    const { statusCode, message } = classifyError(error)
    throw createError({ statusCode, statusMessage: message })
  }

  // Stream setup succeeded — now safe to persist the user turn. If the stream
  // truncates later we still get a user msg + the EMPTY_REPLY_AFTER_RETRIEVAL
  // placeholder from the .then() below, so the conversation stays consistent.
  if (lastUser) {
    await appendUserMessage(conversationId, lastUser, lastUserText)
      .then(() => refreshConversationTitleFromUserPrompt(conversationId, lastUserText))
      .catch((err) => console.error('[chat] failed to persist user message:', err))
  }

  // When the stream finishes, persist the assistant message and audit the query.
  Promise.resolve(result.text)
    .then(async (text) => {
      const sources = [
        ...new Map(
          retrievedChunks.map((r) => [
            r.chunkId,
            {
              chunkId: r.chunkId,
              documentId: r.documentId,
              documentTitle: r.documentTitle,
              score: r.score,
            },
          ]),
        ).values(),
      ]
      const trimmed = (text ?? '').trim()
      const persistText =
        trimmed || (retrievedChunks.length > 0 ? EMPTY_REPLY_AFTER_RETRIEVAL : '')
      const parts: Array<{ type: string; text?: string }> = [{ type: 'text', text: persistText }]
      try {
        await appendAssistantMessage(conversationId, persistText, parts, sources, null)
        scheduleRefineConversationTitle(conversationId)
      } catch (err) {
        console.error('[chat] failed to persist assistant message:', err)
      }
      await logRagQuery({
        queryText: lastUserText,
        responseText: persistText,
        results: retrievedChunks,
        latencyMs: Date.now() - startedAt,
        userId,
        conversationId,
        toolCalled: retrievedChunks.length > 0,
      })
    })
    .catch((err) => {
      console.error('[chat] post-stream persistence error:', err)
    })

  return result.toUIMessageStreamResponse({
    headers: { 'x-conversation-id': conversationId },
  })
})
