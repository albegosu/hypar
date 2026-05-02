import { createOllama, normalizeOllamaNativeHost } from './ollama'
import OpenAI from 'openai'

const DEFAULT_DIMENSIONS = 768

class LruCache<V> {
  private readonly store = new Map<string, V>()
  constructor(private readonly capacity: number) {}

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

function getConfig() {
  const config = useRuntimeConfig()
  const dimensions =
    Number.isFinite(config.embeddingDimensions) && config.embeddingDimensions > 0
      ? Number(config.embeddingDimensions)
      : DEFAULT_DIMENSIONS
  return {
    googleApiKey: config.googleApiKey as string,
    openaiApiKey: config.openaiApiKey as string,
    ollamaUrl: config.ollamaUrl as string,
    ollamaApiKey: config.ollamaApiKey as string,
    ollamaModel: config.ollamaModel as string,
    dimensions,
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const cfg = getConfig()

  const prefix = cfg.googleApiKey
    ? `google:gemini-embedding-001:${cfg.dimensions}|`
    : cfg.openaiApiKey
      ? `openai:text-embedding-3-small:${cfg.dimensions}|`
      : `ollama:${cfg.ollamaModel}:${cfg.dimensions}|`

  const key = prefix + text
  const cached = embeddingCache.get(key)
  if (cached) return cached

  let vector: number[]
  if (cfg.googleApiKey) {
    vector = await generateGoogle(text, cfg.googleApiKey, cfg.dimensions)
  } else if (cfg.openaiApiKey) {
    vector = await generateOpenAI(text, cfg.openaiApiKey, cfg.dimensions)
  } else {
    vector = await generateOllama(text, cfg.ollamaUrl, cfg.ollamaApiKey, cfg.ollamaModel, cfg.dimensions)
  }

  if (vector.length !== cfg.dimensions) {
    throw createError({
      statusCode: 500,
      statusMessage: `Embedding dimension mismatch: model returned ${vector.length}, expected ${cfg.dimensions}`,
    })
  }

  embeddingCache.set(key, vector)
  return vector
}

async function generateGoogle(text: string, apiKey: string, dimensions: number): Promise<number[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      outputDimensionality: dimensions,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw createError({ statusCode: 503, statusMessage: `Google embedding failed: ${body}` })
  }

  const data = await response.json() as { embedding?: { values?: number[] } }
  const embedding = data?.embedding?.values
  if (!Array.isArray(embedding)) {
    throw createError({ statusCode: 503, statusMessage: 'Invalid embedding response from Google API' })
  }
  return embedding
}

async function generateOpenAI(text: string, apiKey: string, dimensions: number): Promise<number[]> {
  const openai = new OpenAI({ apiKey })
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float',
    dimensions,
  })
  return response.data[0].embedding
}

async function generateOllama(
  text: string,
  host: string,
  apiKey: string,
  model: string,
  dimensions: number,
): Promise<number[]> {
  const ollama = createOllama(host, apiKey || undefined)
  try {
    const response = await ollama.embeddings({ model, prompt: text })
    return response.embedding
  } catch (error: unknown) {
    const message = String((error as Error)?.message || error)
    if (message.includes('/api/embeddings') && message.includes('not found')) {
      return generateOllamaV1Compatible(text, host, apiKey, model, dimensions)
    }
    throw createError({ statusCode: 503, statusMessage: `Ollama embedding failed: ${message}` })
  }
}

async function generateOllamaV1Compatible(
  text: string,
  host: string,
  apiKey: string,
  model: string,
  _dimensions: number,
): Promise<number[]> {
  const nativeHost = normalizeOllamaNativeHost(host).replace(/\/+$/, '')
  const url = `${nativeHost}/v1/embeddings`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model, input: text }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw createError({ statusCode: 503, statusMessage: `Ollama v1 embedding failed: ${body}` })
  }

  const json = await res.json() as { data?: Array<{ embedding?: number[] }> }
  const embedding = json.data?.[0]?.embedding
  if (!Array.isArray(embedding)) {
    throw createError({ statusCode: 503, statusMessage: 'Ollama v1 embedding: invalid response' })
  }
  return embedding
}
