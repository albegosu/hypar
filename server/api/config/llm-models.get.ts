import { LLM_MODELS_BY_PROVIDER, type LlmModelOption } from '../../utils/llm-models'
import { getSetting } from '../../utils/settings.service'

interface CacheEntry { models: LlmModelOption[]; expiresAt: number }
const modelCache = new Map<string, CacheEntry>()
const CACHE_TTL = 60 * 60 * 1000 // 1 h

async function withCache(
  key: string,
  fetcher: () => Promise<LlmModelOption[]>,
  fallback: LlmModelOption[],
): Promise<LlmModelOption[]> {
  const now = Date.now()
  const hit = modelCache.get(key)
  if (hit && hit.expiresAt > now) return hit.models
  try {
    const models = await fetcher()
    if (models.length) modelCache.set(key, { models, expiresAt: now + CACHE_TTL })
    return models.length ? models : fallback
  } catch {
    return fallback
  }
}

type LlmFetchConfig = Pick<
  ReturnType<typeof useRuntimeConfig>,
  | 'llmProvider'
  | 'ollamaUrl'
  | 'ollamaApiKey'
  | 'ollamaLlmModel'
  | 'openaiApiKey'
  | 'anthropicApiKey'
  | 'mistralApiKey'
  | 'googleApiKey'
  | 'anthropicModel'
  | 'openaiLlmModel'
  | 'mistralModel'
  | 'googleLlmModel'
>

async function resolveLlmFetchLayer(base: ReturnType<typeof useRuntimeConfig>): Promise<LlmFetchConfig> {
  const c = base
  const [
    llmProvider,
    ollamaUrl,
    ollamaApiKey,
    ollamaLlmModel,
    openaiApiKey,
    anthropicApiKey,
    mistralApiKey,
    googleApiKey,
    anthropicModel,
    openaiLlmModel,
    mistralModel,
    googleLlmModel,
  ] = await Promise.all([
    getSetting('LLM_PROVIDER', String(c.llmProvider ?? '')),
    getSetting('OLLAMA_URL', String(c.ollamaUrl ?? '')),
    getSetting('OLLAMA_API_KEY', String(c.ollamaApiKey ?? '')),
    getSetting('OLLAMA_LLM_MODEL', String(c.ollamaLlmModel ?? '')),
    getSetting('OPENAI_API_KEY', String(c.openaiApiKey ?? '')),
    getSetting('ANTHROPIC_API_KEY', String(c.anthropicApiKey ?? '')),
    getSetting('MISTRAL_API_KEY', String(c.mistralApiKey ?? '')),
    getSetting('GOOGLE_API_KEY', String(c.googleApiKey ?? '')),
    getSetting('ANTHROPIC_MODEL', String(c.anthropicModel ?? 'claude-sonnet-4-6')),
    getSetting('OPENAI_LLM_MODEL', String(c.openaiLlmModel ?? 'gpt-4.1-mini')),
    getSetting('MISTRAL_MODEL', String(c.mistralModel ?? 'mistral-medium-latest')),
    getSetting('GOOGLE_LLM_MODEL', String(c.googleLlmModel ?? 'gemini-2.5-flash')),
  ])
  return {
    llmProvider,
    ollamaUrl,
    ollamaApiKey,
    ollamaLlmModel,
    openaiApiKey,
    anthropicApiKey,
    mistralApiKey,
    googleApiKey,
    anthropicModel,
    openaiLlmModel,
    mistralModel,
    googleLlmModel,
  } as LlmFetchConfig
}

async function fetchModels(
  provider: string,
  config: LlmFetchConfig,
): Promise<LlmModelOption[]> {
  const fallback = LLM_MODELS_BY_PROVIDER[provider] ?? []

  if (provider === 'anthropic') {
    return withCache('anthropic', async () => {
      const res = await fetch('https://api.anthropic.com/v1/models', {
        headers: {
          'x-api-key': config.anthropicApiKey as string,
          'anthropic-version': '2023-06-01',
        },
      })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json() as { data: Array<{ id: string; display_name?: string }> }
      return data.data.map((m) => ({ value: m.id, label: m.display_name || m.id }))
    }, fallback)
  }

  if (provider === 'mistral') {
    return withCache('mistral', async () => {
      const res = await fetch('https://api.mistral.ai/v1/models', {
        headers: { Authorization: `Bearer ${config.mistralApiKey as string}` },
      })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json() as { data: Array<{ id: string; type?: string }> }
      return data.data
        .filter((m) => !m.id.includes('embed') && (m.type === 'chat' || !m.type))
        .map((m) => ({ value: m.id, label: m.id }))
    }, fallback)
  }

  if (provider === 'openai') {
    return withCache('openai', async () => {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${config.openaiApiKey as string}` },
      })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json() as { data: Array<{ id: string }> }
      const CHAT_PREFIXES = ['gpt-4', 'gpt-3.5', 'o1', 'o3', 'o4', 'chatgpt']
      return data.data
        .filter((m) => CHAT_PREFIXES.some((p) => m.id.startsWith(p)) && !m.id.includes('instruct'))
        .sort((a, b) => b.id.localeCompare(a.id))
        .map((m) => ({ value: m.id, label: m.id }))
    }, fallback)
  }

  if (provider === 'ollama' || provider === 'ollama-cloud' || provider === 'ollama-local') {
    const ollamaUrl = (config.ollamaUrl as string) || 'http://localhost:11434'
    const ollamaApiKey = config.ollamaApiKey as string | undefined
    return withCache(provider, async () => {
      const baseURL = ollamaUrl.replace(/\/+$/, '')
      const headers: Record<string, string> = {}
      if (ollamaApiKey) headers['Authorization'] = `Bearer ${ollamaApiKey}`
      const res = await fetch(`${baseURL}/api/tags`, { headers })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json() as { models: Array<{ name: string }> }
      return data.models.map((m) => ({ value: m.name, label: m.name }))
    }, fallback)
  }

  // gemini — use static list (API requires extra auth setup)
  return fallback
}

export default defineEventHandler(async (event) => {
  const base = useRuntimeConfig()
  const config = await resolveLlmFetchLayer(base)

  const provider = (config.llmProvider as string)
    || (config.anthropicApiKey ? 'anthropic' : '')
    || (config.mistralApiKey   ? 'mistral'   : '')
    || (config.openaiApiKey    ? 'openai'    : '')
    || (config.googleApiKey    ? 'gemini'    : '')
    || 'ollama'

  const ollamaDefault = (config.ollamaLlmModel as string) || 'kimi-k2.5:cloud'
  const defaultModelMap: Record<string, string> = {
    anthropic:      (config.anthropicModel as string) || 'claude-sonnet-4-6',
    openai:         (config.openaiLlmModel as string) || 'gpt-4.1-mini',
    mistral:        (config.mistralModel   as string) || 'mistral-medium-latest',
    gemini:         (config.googleLlmModel as string) || 'gemini-2.5-flash',
    ollama:         ollamaDefault,
    'ollama-cloud': ollamaDefault,
    'ollama-local': (config.ollamaLlmModel as string) || 'tinyllama',
  }

  const models = await fetchModels(provider, config)

  return {
    provider,
    defaultModel: defaultModelMap[provider] ?? '',
    models,
  }
})
