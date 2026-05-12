import { getSetting, getNumericSetting, getBoolSetting } from '~/server/utils/settings.service'

const DEFAULT_LIMIT = 5
const DEFAULT_MIN_SCORE = 0.2
const DEFAULT_HYBRID_ALPHA = 0.7
const DEFAULT_MMR_LAMBDA = 0.7
const DEFAULT_OVERFETCH = 3

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const [topKStr, thresholdStr, hybridStr, rerankStr] = await Promise.all([
    getSetting('SEARCH_TOP_K', String(config.searchTopK ?? DEFAULT_LIMIT)),
    getSetting('SEARCH_THRESHOLD', String(config.searchThreshold ?? DEFAULT_MIN_SCORE)),
    getSetting('SEARCH_HYBRID', String(config.searchHybrid ?? false)),
    getSetting('SEARCH_RERANK', String(config.searchRerank ?? false)),
  ])

  const hybridEnabled = getBoolSetting(hybridStr, false)
  const rerankEnabled = getBoolSetting(rerankStr, false)

  const llmProvider = (config.llmProvider as string)
    || (config.anthropicApiKey ? 'anthropic' : '')
    || (config.mistralApiKey ? 'mistral' : '')
    || (config.openaiApiKey ? 'openai' : '')
    || 'ollama'

  const llmModelMap: Record<string, string> = {
    anthropic: config.anthropicModel as string || 'claude-sonnet-4-6',
    openai: config.openaiLlmModel as string || 'gpt-4.1-mini',
    mistral: config.mistralModel as string || 'mistral-medium-latest',
    ollama: config.ollamaLlmModel as string || 'tinyllama',
  }

  return {
    topK: Math.max(1, getNumericSetting(topKStr, DEFAULT_LIMIT)),
    minScore: getNumericSetting(thresholdStr, DEFAULT_MIN_SCORE),
    hybridAlpha: hybridEnabled ? DEFAULT_HYBRID_ALPHA : 1.0,
    mmrLambda: DEFAULT_MMR_LAMBDA,
    embeddingDims: Number(config.embeddingDimensions ?? 768),
    hybridEnabled,
    rerankEnabled,
    overFetch: DEFAULT_OVERFETCH,
    llmModel: llmModelMap[llmProvider] ?? llmProvider,
    llmProvider,
  }
})
