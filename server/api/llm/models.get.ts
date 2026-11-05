import { prisma } from '~/server/utils/prisma'
import { getOllamaRuntime } from '~/server/utils/ollama'
import { requireSessionUserId } from '~/server/utils/session'
import { logger } from '~/server/utils/logger'
import { listProviderModels, ProviderKeyRejectedError, type ListedModel } from '~/server/utils/llm-provider'
import { openSecret } from '~/server/utils/secret-box'
import { LLM_PROVIDER_INFO, type LlmProviderId } from '~/utils/llm-providers'
import { sanitizeModelId } from '~/utils/llm-model'

/** Models for the collaborator: from the user's own provider when connected, else the server Ollama. */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)

  const connection = await prisma.providerConnection.findUnique({ where: { userId } })
  if (connection) {
    const provider = connection.provider as LlmProviderId
    const info = LLM_PROVIDER_INFO[provider]
    const defaultModel = sanitizeModelId(connection.collaboratorModel) || info.defaultModel
    let models: ListedModel[] = []
    try {
      models = await listProviderModels(provider, openSecret(connection.apiKeyCiphertext))
    }
    catch (err) {
      const message = err instanceof ProviderKeyRejectedError
        ? `${info.label} rejected the saved key`
        : `could not list ${info.label} models`
      logger.warn('provider model listing failed', { provider, message })
      throw createError({ statusCode: 502, statusMessage: message })
    }
    if (!models.some(m => m.id === defaultModel)) {
      models.unshift({ id: defaultModel, name: defaultModel, provider: info.label, description: 'selected' })
    }
    return { own: true, defaultModel, models }
  }

  const { host, apiKey, isCloud, defaultModel } = getOllamaRuntime()
  const provider = isCloud ? 'Ollama Cloud' : 'Ollama'
  const headers: Record<string, string> = {}
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`

  const models: ListedModel[] = []

  try {
    const tags = await $fetch<{ models?: Array<{ name?: string; details?: { parameter_size?: string } }> }>(
      `${host}/api/tags`,
      { headers },
    )
    for (const m of tags.models ?? []) {
      if (!m.name) continue
      models.push({
        id: m.name,
        name: m.name,
        provider,
        description: m.details?.parameter_size,
      })
    }
  }
  catch (err) {
    logger.warn('ollama /api/tags failed, trying /v1/models', {
      message: err instanceof Error ? err.message : String(err),
    })
    try {
      const openai = await $fetch<{ data?: Array<{ id?: string }> }>(`${host}/v1/models`, { headers })
      for (const m of openai.data ?? []) {
        if (!m.id) continue
        models.push({ id: m.id, name: m.id, provider })
      }
    }
    catch (fallbackErr) {
      logger.warn('ollama /v1/models failed', {
        message: fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr),
      })
    }
  }

  if (!models.some(m => m.id === defaultModel)) {
    models.unshift({
      id: defaultModel,
      name: defaultModel,
      provider,
      description: 'configured default',
    })
  }

  return { own: false, defaultModel, models }
})
