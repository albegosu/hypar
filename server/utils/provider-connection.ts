import { prisma } from '~/server/utils/prisma'
import { getOllamaRuntime } from '~/server/utils/ollama'
import type { LlmProviderId } from '~/utils/llm-providers'

export interface ProviderSettingsView {
  connection: {
    provider: LlmProviderId
    keyHint: string
    collaboratorModel: string | null
    updatedAt: Date
  } | null
  fallback: { label: string; defaultModel: string }
}

/** What Settings may know about the provider. The key itself never leaves the server. */
export async function providerSettingsView(userId: string): Promise<ProviderSettingsView> {
  const row = await prisma.providerConnection.findUnique({
    where: { userId },
    select: { provider: true, apiKeyHint: true, collaboratorModel: true, updatedAt: true },
  })
  const { isCloud, defaultModel } = getOllamaRuntime()
  return {
    connection: row
      ? {
          provider: row.provider as LlmProviderId,
          keyHint: row.apiKeyHint,
          collaboratorModel: row.collaboratorModel,
          updatedAt: row.updatedAt,
        }
      : null,
    fallback: { label: isCloud ? 'Ollama Cloud' : 'Ollama', defaultModel },
  }
}
