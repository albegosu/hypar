import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import { logger } from '~/server/utils/logger'
import { ProviderKeyRejectedError, isListedModel, listProviderModels, verifyProviderKey } from '~/server/utils/llm-provider'
import { providerSettingsView } from '~/server/utils/provider-connection'
import { openSecret, sealSecret, secretHint } from '~/server/utils/secret-box'
import { LLM_PROVIDERS, LLM_PROVIDER_INFO } from '~/utils/llm-providers'
import { sanitizeModelId } from '~/utils/llm-model'

const bodySchema = z.object({
  provider: z.enum(LLM_PROVIDERS),
  apiKey: z.string().trim().min(8).max(500).optional(),
  collaboratorModel: z.string().trim().max(96).nullable().optional(),
  researchModel: z.string().trim().max(96).nullable().optional(),
  criticModel: z.string().trim().max(96).nullable().optional(),
})

/** null/'' clears an override, a valid id sets it, undefined leaves it. */
function parseModel(value: string | null | undefined): string | null | undefined {
  if (value === undefined) return undefined
  if (value === null || value === '') return null
  const id = sanitizeModelId(value)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid model id' })
  return id
}

/**
 * Connect a provider (new key) or change the collaborator model of the current one.
 * A new key is checked against the provider before it is stored, encrypted (ADR 0008).
 */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const body = await readValidatedBody(event, bodySchema.parse)
  const info = LLM_PROVIDER_INFO[body.provider]

  const collaboratorModel = parseModel(body.collaboratorModel)
  const researchModel = parseModel(body.researchModel)
  const criticModel = parseModel(body.criticModel)

  const existing = await prisma.providerConnection.findUnique({ where: { userId } })

  if (!body.apiKey) {
    if (!existing || existing.provider !== body.provider) {
      throw createError({ statusCode: 400, statusMessage: `An API key is required to connect ${info.label}` })
    }
    // A role model the provider does not offer is rejected, not saved.
    const chosen = [researchModel, criticModel].filter((m): m is string => !!m)
    if (chosen.length) {
      let listed
      try {
        listed = await listProviderModels(body.provider, openSecret(existing.apiKeyCiphertext))
      }
      catch {
        throw createError({ statusCode: 502, statusMessage: `Could not list ${info.label} models to check the choice` })
      }
      if (chosen.some(m => !isListedModel(m, listed))) {
        throw createError({ statusCode: 400, statusMessage: `${info.label} does not offer that model` })
      }
    }
    await prisma.providerConnection.update({
      where: { userId },
      data: {
        ...(collaboratorModel !== undefined ? { collaboratorModel } : {}),
        ...(researchModel !== undefined ? { researchModel } : {}),
        ...(criticModel !== undefined ? { criticModel } : {}),
      },
    })
    return providerSettingsView(userId)
  }

  try {
    await verifyProviderKey(body.provider, body.apiKey)
  }
  catch (err) {
    if (err instanceof ProviderKeyRejectedError) {
      throw createError({ statusCode: 400, statusMessage: `${info.label} rejected this key` })
    }
    logger.warn('provider key check failed', {
      provider: body.provider,
      message: err instanceof Error ? err.message.slice(0, 200) : 'unknown',
    })
    throw createError({ statusCode: 502, statusMessage: `Could not reach ${info.label} to check the key` })
  }

  const data = {
    provider: body.provider,
    apiKeyCiphertext: sealSecret(body.apiKey),
    apiKeyHint: secretHint(body.apiKey),
    // A new provider starts from its default model unless one was chosen.
    collaboratorModel: collaboratorModel !== undefined
      ? collaboratorModel
      : existing?.provider === body.provider ? existing.collaboratorModel : null,
    // Role overrides belong to a provider's model list: a new provider clears them.
    researchModel: existing?.provider === body.provider ? existing.researchModel : null,
    criticModel: existing?.provider === body.provider ? existing.criticModel : null,
  }
  await prisma.providerConnection.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  })
  return providerSettingsView(userId)
})
