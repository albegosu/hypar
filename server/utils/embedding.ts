import { embed, embedMany, type EmbeddingModel } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { normalizeOllamaNativeHost } from './ollama.ts'

const DEFAULT_DIMENSIONS = 768

class LruCache<V> {
  private readonly store = new Map<string, V>()
  private readonly capacity: number
  constructor(capacity: number) { this.capacity = capacity }

  get(key: string): V | undefined {
    const value = this.store.get(key)
    if (value === undefined) return undefined
    this.store.delete(key)
    this.store.set(key, value)
    return value
  }

  set(key: string, value: V): void {
    if (this.store.has(key)) {
      this.store.delete(key)
    } else if (this.store.size >= this.capacity) {
      const oldest = this.store.keys().next().value
      if (oldest !== undefined) this.store.delete(oldest)
    }
    this.store.set(key, value)
  }
}

const embeddingCache = new LruCache<number[]>(256)

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

  // Explicit provider selection via EMBEDDING_PROVIDER env var
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

  // Default: Ollama (local or cloud)
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

export async function generateEmbedding(text: string): Promise<number[]> {
  const { model, dimensions, cacheKeyPrefix, providerOptions } = resolveEmbedder()
  const cacheKey = cacheKeyPrefix + text

  const cached = embeddingCache.get(cacheKey)
  if (cached) return cached

  try {
    const { embedding } = await embed({ model, value: text, providerOptions: providerOptions as never })
    const vector = assertDimensions(embedding, dimensions)
    embeddingCache.set(cacheKey, vector)
    return vector
  } catch (err: unknown) {
    const message = (err as Error)?.message || String(err)
    throw createError({ statusCode: 503, statusMessage: `Embedding failed: ${message}` })
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (!texts.length) return []
  const { model, dimensions, cacheKeyPrefix, providerOptions } = resolveEmbedder()

  const out: number[][] = new Array(texts.length)
  const missingIdx: number[] = []
  const missingTexts: string[] = []

  for (let i = 0; i < texts.length; i++) {
    const cached = embeddingCache.get(cacheKeyPrefix + texts[i])
    if (cached) {
      out[i] = cached
    } else {
      missingIdx.push(i)
      missingTexts.push(texts[i])
    }
  }

  if (missingTexts.length) {
    try {
      const { embeddings } = await embedMany({ model, values: missingTexts, providerOptions: providerOptions as never })
      for (let j = 0; j < missingTexts.length; j++) {
        const vector = assertDimensions(embeddings[j], dimensions)
        const idx = missingIdx[j]
        out[idx] = vector
        embeddingCache.set(cacheKeyPrefix + missingTexts[j], vector)
      }
    } catch (err: unknown) {
      const message = (err as Error)?.message || String(err)
      throw createError({ statusCode: 503, statusMessage: `Embedding failed: ${message}` })
    }
  }

  return out
}
