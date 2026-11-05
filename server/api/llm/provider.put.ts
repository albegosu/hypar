import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import { logger } from '~/server/utils/logger'
import { ProviderKeyRejectedError, verifyProviderKey } from '~/server/utils/llm-provider'
import { providerSettingsView } from '~/server/utils/provider-connection'
import { sealSecret, secretHint } from '~/server/utils/secret-box'
import { LLM_PROVIDERS, LLM_PROVIDER_INFO } from '~/utils/llm-providers'
import { sanitizeModelId } from '~/utils/llm-model'

const bodySchema = z.object({
  provider: z.enum(LLM_PROVIDERS),
  apiKey: z.string().trim().min(8).max(500).optional(),
  collaboratorModel: z.string().trim().max(96).nullable().optional(),
})

/**
 * Connect a provider (new key) or change the collaborator model of the current one.
 * A new key is checked against the provider before it is stored, encrypted (ADR 0008).
 */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const body = await readValidatedBody(event, bodySchema.parse)
  const info = LLM_PROVIDER_INFO[body.provider]

  let collaboratorModel: string | null | undefined
  if (body.collaboratorModel !== undefined) {
    collaboratorModel = body.collaboratorModel === null || body.collaboratorModel === ''
      ? null
      : sanitizeModelId(body.collaboratorModel) ?? null
    if (body.collaboratorModel && !collaboratorModel) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid model id' })
    }
  }

  const existing = await prisma.providerConnection.findUnique({ where: { userId } })

  if (!body.apiKey) {
    if (!existing || existing.provider !== body.provider) {
      throw createError({ statusCode: 400, statusMessage: `An API key is required to connect ${info.label}` })
    }
    await prisma.providerConnection.update({
      where: { userId },
      data: collaboratorModel !== undefined ? { collaboratorModel } : {},
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
  }
  await prisma.providerConnection.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  })
  return providerSettingsView(userId)
})
