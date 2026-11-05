import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModel } from 'ai'
import { prisma } from '~/server/utils/prisma'
import { createOllamaChatModel, getOllamaRuntime } from '~/server/utils/ollama'
import { openSecret } from '~/server/utils/secret-box'
import { LLM_PROVIDER_INFO, isOpenAiChatModel, type LlmProviderId } from '~/utils/llm-providers'
import { sanitizeModelId } from '~/utils/llm-model'

const OLLAMA_CLOUD_HOST = 'https://ollama.com'

export interface ResolvedChatModel {
  model: LanguageModel
  modelId: string
  timeoutMs: number
  /** Provider name for honest error messages. */
  label: string
  /** True when the user's own key is in use; false for the server fallback. */
  own: boolean
  maxOutputTokens?: number
}

export interface ListedModel {
  id: string
  name: string
  provider: string
  description?: string
}

function chatTimeoutMs(): number {
  return Number(useRuntimeConfig().ollamaChatTimeoutMs) || 180_000
}

export function providerChatModel(provider: LlmProviderId, apiKey: string, modelId: string): LanguageModel {
  switch (provider) {
    case 'ANTHROPIC':
      return createAnthropic({ apiKey })(modelId)
    case 'OPENAI':
      return createOpenAI({ apiKey })(modelId)
    case 'OLLAMA_CLOUD':
      return createOpenAI({ baseURL: `${OLLAMA_CLOUD_HOST}/v1`, apiKey, name: 'ollama' }).chat(modelId)
  }
}

/**
 * The collaborator model for this user (ADR 0008): their own provider when connected,
 * otherwise the server-wide Ollama fallback. `requestedModel` (the Settings cookie)
 * only applies to the fallback; a connected user's model is stored with the connection.
 */
export async function resolveChatModel(userId: string, requestedModel?: string): Promise<ResolvedChatModel> {
  const connection = await prisma.providerConnection.findUnique({ where: { userId } })
  if (!connection) {
    const { model, modelId, timeoutMs } = createOllamaChatModel(requestedModel)
    const { isCloud } = getOllamaRuntime()
    return { model, modelId, timeoutMs, label: isCloud ? 'Ollama Cloud' : 'Ollama', own: false }
  }

  const provider = connection.provider as LlmProviderId
  const info = LLM_PROVIDER_INFO[provider]
  let apiKey: string
  try {
    apiKey = openSecret(connection.apiKeyCiphertext)
  }
  catch {
    throw createError({
      statusCode: 409,
      statusMessage: `Your ${info.label} key can no longer be read. Connect it again in Settings.`,
    })
  }
  const modelId = sanitizeModelId(connection.collaboratorModel) || info.defaultModel
  return {
    model: providerChatModel(provider, apiKey, modelId),
    modelId,
    timeoutMs: chatTimeoutMs(),
    label: info.label,
    own: true,
    // Thinking counts against the output cap on current Claude models.
    maxOutputTokens: provider === 'ANTHROPIC' ? 16_000 : undefined,
  }
}

/** Raised when the provider refuses the key while listing models. */
export class ProviderKeyRejectedError extends Error {}

function statusOf(err: unknown): number | undefined {
  const e = err as { statusCode?: number; status?: number; response?: { status?: number } }
  return e?.statusCode ?? e?.status ?? e?.response?.status
}

/**
 * Checks the key with the provider before it is saved. Anthropic and OpenAI only list models
 * for a valid key. Ollama Cloud lists models without auth, so the check calls chat with a model
 * that does not exist: auth runs first, and nothing is generated or billed.
 * Throws ProviderKeyRejectedError on 401/403; other failures propagate.
 */
export async function verifyProviderKey(provider: LlmProviderId, apiKey: string): Promise<void> {
  if (provider !== 'OLLAMA_CLOUD') {
    await listProviderModels(provider, apiKey)
    return
  }
  try {
    await $fetch(`${OLLAMA_CLOUD_HOST}/v1/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: { model: 'hypar-key-check', messages: [{ role: 'user', content: '.' }], max_tokens: 1 },
    })
  }
  catch (err) {
    const status = statusOf(err)
    if (status === 401 || status === 403) throw new ProviderKeyRejectedError('Ollama Cloud rejected the key')
    if (status && status < 500) return
    throw err
  }
}

/**
 * Lists chat models the key can use. Hosts are fixed per provider, so no user-supplied URL is
 * ever fetched. Throws ProviderKeyRejectedError on 401/403; other failures propagate.
 */
export async function listProviderModels(provider: LlmProviderId, apiKey: string): Promise<ListedModel[]> {
  const label = LLM_PROVIDER_INFO[provider].label
  try {
    switch (provider) {
      case 'ANTHROPIC': {
        const res = await $fetch<{ data?: Array<{ id?: string; display_name?: string }> }>(
          'https://api.anthropic.com/v1/models?limit=100',
          { headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' } },
        )
        return (res.data ?? [])
          .filter(m => m.id)
          .map(m => ({ id: m.id!, name: m.display_name || m.id!, provider: label }))
      }
      case 'OPENAI': {
        const res = await $fetch<{ data?: Array<{ id?: string }> }>(
          'https://api.openai.com/v1/models',
          { headers: { Authorization: `Bearer ${apiKey}` } },
        )
        return (res.data ?? [])
          .map(m => m.id)
          .filter((id): id is string => !!id && isOpenAiChatModel(id))
          .sort()
          .map(id => ({ id, name: id, provider: label }))
      }
      case 'OLLAMA_CLOUD': {
        const res = await $fetch<{ models?: Array<{ name?: string; details?: { parameter_size?: string } }> }>(
          `${OLLAMA_CLOUD_HOST}/api/tags`,
          { headers: { Authorization: `Bearer ${apiKey}` } },
        )
        return (res.models ?? [])
          .filter(m => m.name)
          .map(m => ({ id: m.name!, name: m.name!, provider: label, description: m.details?.parameter_size }))
      }
    }
  }
  catch (err) {
    const status = statusOf(err)
    if (status === 401 || status === 403) throw new ProviderKeyRejectedError(`${label} rejected the key`)
    throw err
  }
}
