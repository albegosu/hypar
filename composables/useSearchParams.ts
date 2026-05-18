export interface SearchParamsConfig {
  topK: number
  minScore: number
  hybridAlpha: number
  mmrLambda: number
  embeddingDims: number
  embeddingProvider: string
  hybridEnabled: boolean
  rerankEnabled: boolean
  overFetch: number
  llmModel: string
  llmProvider: string
}

let cached: SearchParamsConfig | null = null

export async function useSearchParams(): Promise<SearchParamsConfig> {
  if (cached) return cached
  cached = await $fetch<SearchParamsConfig>('/api/config/search-params')
  return cached
}

export function clearSearchParamsCache() {
  cached = null
}
