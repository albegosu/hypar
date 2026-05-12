import { embed, embedMany, type EmbeddingModel } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { normalizeOllamaNativeHost } from './ollama.ts'
import { getSetting, getNumericSetting, getBoolSetting } from './settings.service.ts'

const DEFAULT_DIMENSIONS = 768

interface CacheEntry<V> {
  value: V
  expiresAt: number
}

class LruCache<V> {
  private readonly store = new Map<string, CacheEntry<V>>()
  private readonly capacity: number

  constructor(capacity: number) {
    this.capacity = capacity
  }

  get(key: string): V | undefined {
    const entry = this.store.get(key)
    if (entry === undefined) return undefined
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    this.store.delete(key)
    this.store.set(key, entry)
    return entry.value
  }

  set(key: string, value: V, ttlMs = Infinity): void {
    if (this.store.has(key)) {
      this.store.delete(key)
    } else if (this.store.size >= this.capacity) {
      const oldest = this.store.keys().next().value
      if (oldest !== undefined) this.store.delete(oldest)
    }
    this.store.set(key, { value, expiresAt: ttlMs === Infinity ? Infinity : Date.now() + ttlMs })
  }
}

const embeddingCache = new LruCache<number[]>(256)

async function getEmbeddingSettings() {
  const config = useRuntimeConfig()
  const [cacheEnabledStr, cacheTtlStr, retryStr, batchStr] = await Promise.all([
    getSetting('EMBEDDING_CACHE_ENABLED', String(config.embeddingCacheEnabled ?? true)),
    getSetting('EMBEDDING_CACHE_TTL', String(config.embeddingCacheTtl ?? 3600)),
    getSetting('EMBEDDING_RETRY_ATTEMPTS', String(config.embeddingRetryAttempts ?? 3)),
    getSetting('EMBEDDING_BATCH_SIZE', String(config.embeddingBatchSize ?? 32)),
  ])
  return {
    cacheEnabled: getBoolSetting(cacheEnabledStr, true),
    cacheTtlMs: getNumericSetting(cacheTtlStr, 3600) * 1000,
    retryAttempts: Math.max(1, getNumericSetting(retryStr, 3)),
    batchSize: Math.max(1, getNumericSetting(batchStr, 32)),
  }
}

interface ResolvedEmbedder {
  model: EmbeddingModel
  dimensions: number
  cacheKeyPrefix: string
  providerOptions?: Record<string, Record<string, unknown>>
}

function resolveEmbedder(): ResolvedEmbedder {
  const config = useRuntimeConfig()
  const dimensions =
    Number.isFinite(config.embeddingDimensions) && (config.embeddingDimensions as number) > 0
      ? Number(config.embeddingDimensions)
      : DEFAULT_DIMENSIONS

  const embeddingProvider = (config.embeddingProvider as string) || ''
  const embeddingModel = (config.embeddingModel as string) || ''
  const googleApiKey = config.googleApiKey as string
  const openaiApiKey = config.openaiApiKey as string
  const voyageApiKey = config.voyageApiKey as string
  const ollamaUrl = config.ollamaUrl as string
  const ollamaApiKey = config.ollamaApiKey as string
  const ollamaModel = config.ollamaModel as string

  if (embeddingProvider === 'gemini' || (!embeddingProvider && googleApiKey)) {
    const model = embeddingModel || 'gemini-embedding-001'
    const google = createGoogleGenerativeAI({ apiKey: googleApiKey })
    return {
      model: google.textEmbeddingModel(model),
      dimensions,
      cacheKeyPrefix: `google:${model}:${dimensions}|`,
      providerOptions: { google: { outputDimensionality: dimensions } },
    }
  }

  if (embeddingProvider === 'openai' || (!embeddingProvider && openaiApiKey)) {
    const model = embeddingModel || 'text-embedding-3-small'
    const openai = createOpenAI({ apiKey: openaiApiKey })
    return {
      model: openai.textEmbeddingModel(model),
      dimensions,
      cacheKeyPrefix: `openai:${model}:${dimensions}|`,
      providerOptions: { openai: { dimensions } },
    }
  }

  if (embeddingProvider === 'voyage' || (!embeddingProvider && voyageApiKey)) {
    const model = embeddingModel || 'voyage-3'
    const voyage = createOpenAI({
      apiKey: voyageApiKey,
      baseURL: 'https://api.voyageai.com/v1',
      name: 'voyage',
    })
    return {
      model: voyage.textEmbeddingModel(model),
      dimensions,
      cacheKeyPrefix: `voyage:${model}:${dimensions}|`,
    }
  }

  const model = embeddingModel || ollamaModel
  const baseURL = normalizeOllamaNativeHost(ollamaUrl).replace(/\/+$/, '') + '/v1'
  const ollama = createOpenAI({
    apiKey: ollamaApiKey || 'ollama',
    baseURL,
    name: 'ollama',
  })
  return {
    model: ollama.textEmbeddingModel(model),
    dimensions,
    cacheKeyPrefix: `ollama:${model}:${dimensions}|`,
  }
}

function assertDimensions(vector: number[], expected: number): number[] {
  if (vector.length !== expected) {
    throw createError({
      statusCode: 500,
      statusMessage: `Embedding dimension mismatch: model returned ${vector.length}, expected ${expected}`,
    })
  }
  return vector
}

async function withRetry<T>(fn: () => Promise<T>, attempts: number): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, (i + 1) * 300))
    }
  }
  throw lastErr
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const { model, dimensions, cacheKeyPrefix, providerOptions } = resolveEmbedder()
  const { cacheEnabled, cacheTtlMs, retryAttempts } = await getEmbeddingSettings()
  const cacheKey = cacheKeyPrefix + text

  if (cacheEnabled) {
    const cached = embeddingCache.get(cacheKey)
    if (cached) return cached
  }

  try {
    const vector = await withRetry(async () => {
      const { embedding } = await embed({ model, value: text, providerOptions: providerOptions as never })
      return assertDimensions(embedding, dimensions)
    }, retryAttempts)
    if (cacheEnabled) embeddingCache.set(cacheKey, vector, cacheTtlMs)
    return vector
  } catch (err: unknown) {
    const message = (err as Error)?.message || String(err)
    throw createError({ statusCode: 503, statusMessage: `Embedding failed: ${message}` })
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (!texts.length) return []
  const { model, dimensions, cacheKeyPrefix, providerOptions } = resolveEmbedder()
  const { cacheEnabled, cacheTtlMs, retryAttempts, batchSize } = await getEmbeddingSettings()

  const out: number[][] = new Array(texts.length)
  const missingIdx: number[] = []
  const missingTexts: string[] = []

  for (let i = 0; i < texts.length; i++) {
    const cacheHit = cacheEnabled ? embeddingCache.get(cacheKeyPrefix + texts[i]) : undefined
    if (cacheHit) {
      out[i] = cacheHit
    } else {
      missingIdx.push(i)
      missingTexts.push(texts[i])
    }
  }

  if (missingTexts.length) {
    try {
      for (let start = 0; start < missingTexts.length; start += batchSize) {
        const batchTexts = missingTexts.slice(start, start + batchSize)
        const batchIdx = missingIdx.slice(start, start + batchSize)

        const embeddings = await withRetry(async () => {
          const { embeddings: result } = await embedMany({ model, values: batchTexts, providerOptions: providerOptions as never })
          return result
        }, retryAttempts)

        for (let j = 0; j < batchTexts.length; j++) {
          const vector = assertDimensions(embeddings[j], dimensions)
          const idx = batchIdx[j]
          out[idx] = vector
          if (cacheEnabled) embeddingCache.set(cacheKeyPrefix + batchTexts[j], vector, cacheTtlMs)
        }
      }
    } catch (err: unknown) {
      const message = (err as Error)?.message || String(err)
      throw createError({ statusCode: 503, statusMessage: `Embedding failed: ${message}` })
    }
  }

  return out
}
