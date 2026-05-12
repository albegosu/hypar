export interface LlmModelOption {
  value: string
  label: string
  default?: boolean
}

export interface LlmModelsConfig {
  provider: string
  defaultModel: string
  models: LlmModelOption[]
}

const MODEL_KEY = 'rag-ui:selectedModel'
let cached: LlmModelsConfig | null = null

export async function fetchLlmModels(): Promise<LlmModelsConfig> {
  if (!cached) cached = await $fetch<LlmModelsConfig>('/api/config/llm-models')
  return cached
}

export function getPersistedModel(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(MODEL_KEY)
}

export function persistModel(model: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(MODEL_KEY, model)
}
