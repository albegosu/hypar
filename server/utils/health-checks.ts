import { getSetting } from './settings.service'

/** Probes the configured embedding provider (not only Ollama). */
export async function checkEmbeddingProvider(): Promise<boolean> {
  const config = useRuntimeConfig()
  const [provider, googleKey, openaiKey, voyageKey, ollamaUrl] = await Promise.all([
    getSetting('EMBEDDING_PROVIDER', String(config.embeddingProvider ?? '')),
    getSetting('GOOGLE_API_KEY', String(config.googleApiKey ?? '')),
    getSetting('OPENAI_API_KEY', String(config.openaiApiKey ?? '')),
    getSetting('VOYAGE_API_KEY', String(config.voyageApiKey ?? '')),
    getSetting('OLLAMA_URL', String(config.ollamaUrl ?? 'http://localhost:11434')),
  ])

  const p = provider.trim().toLowerCase()

  if (p === 'gemini' || p === 'google' || (!p && googleKey)) {
    return Boolean(googleKey.trim())
  }
  if (p === 'openai' || (!p && openaiKey && !googleKey)) {
    return Boolean(openaiKey.trim())
  }
  if (p === 'voyage') {
    return Boolean(voyageKey.trim())
  }

  try {
    await $fetch(`${ollamaUrl}/api/tags`, { timeout: 3000 } as Parameters<typeof $fetch>[1])
    return true
  } catch {
    return false
  }
}
