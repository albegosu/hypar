import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ollama } from 'ollama';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createOllama, normalizeOllamaNativeHost } from '../ollama/create-ollama';

const DEFAULT_DIMENSIONS = 768;

/**
 * Tiny LRU. Caches the embedding for a given (model, text) so that repeating
 * the same search query (very common from the chat UI) doesn't re-hit Ollama
 * or OpenAI. Bounded so we never grow unboundedly under memory pressure.
 */
class LruCache<V> {
  private readonly store = new Map<string, V>();
  constructor(private readonly capacity: number) {}

  get(key: string): V | undefined {
    const value = this.store.get(key);
    if (value === undefined) return undefined;
    this.store.delete(key);
    this.store.set(key, value);
    return value;
  }

  set(key: string, value: V): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.capacity) {
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) this.store.delete(oldest);
    }
    this.store.set(key, value);
  }
}

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private ollama: Ollama;
  private openai: OpenAI;
  private googleAI?: GoogleGenerativeAI;
  private useOpenAI: boolean;
  private useGoogleAI: boolean;
  private localOllama?: Ollama;
  private ollamaHost: string;
  private ollamaApiKey?: string;
  private ollamaEmbeddingModel: string;
  private readonly dimensions: number;
  private readonly cache = new LruCache<number[]>(256);
  private readonly cacheKeyPrefix: string;

  constructor(private config: ConfigService) {
    const host = config.get<string>('OLLAMA_URL') || 'http://localhost:11434';
    const apiKey = config.get<string>('OLLAMA_API_KEY');
    this.ollamaHost = host;
    this.ollamaApiKey = apiKey;
    this.ollamaEmbeddingModel =
      config.get<string>('OLLAMA_MODEL') || 'nomic-embed-text';
    this.ollama = createOllama(host, apiKey);
    const normalizedHost = normalizeOllamaNativeHost(host).toLowerCase();
    if (!normalizedHost.includes('://ollama:11434')) {
      this.localOllama = createOllama('http://ollama:11434', undefined);
    }

    // Initialize Google AI if API key is provided
    const googleApiKey = config.get<string>('GOOGLE_API_KEY');
    if (googleApiKey) {
      this.googleAI = new GoogleGenerativeAI(googleApiKey);
    }
    this.useGoogleAI = !!googleApiKey;

    this.openai = new OpenAI({ apiKey: config.get('OPENAI_API_KEY') });
    this.useOpenAI = !!config.get('OPENAI_API_KEY');

    const rawDims = Number(config.get('EMBEDDING_DIMENSIONS'));
    this.dimensions = Number.isFinite(rawDims) && rawDims > 0 ? rawDims : DEFAULT_DIMENSIONS;

    // Set cache key prefix based on provider priority: Google > OpenAI > Ollama
    if (this.useGoogleAI) {
      this.cacheKeyPrefix = `google:gemini-embedding-001:${this.dimensions}|`;
    } else if (this.useOpenAI) {
      this.cacheKeyPrefix = `openai:text-embedding-3-small:${this.dimensions}|`;
    } else {
      this.cacheKeyPrefix = `ollama:${this.ollamaEmbeddingModel}:${this.dimensions}|`;
    }

    this.logger.log(`Using embedding provider: ${this.useGoogleAI ? 'Google Gemini' : this.useOpenAI ? 'OpenAI' : 'Ollama'}`);
  }

  /** Length of vectors this service produces. The DB column must match. */
  get dimensionCount(): number {
    return this.dimensions;
  }

  async generate(text: string): Promise<number[]> {
    const key = this.cacheKeyPrefix + text;
    const cached = this.cache.get(key);
    if (cached) return cached;

    let vector: number[];
    if (this.useGoogleAI) {
      vector = await this.generateGoogle(text);
    } else if (this.useOpenAI) {
      vector = await this.generateOpenAI(text);
    } else {
      vector = await this.generateOllama(text);
    }

    this.assertDimensions(vector);
    this.cache.set(key, vector);
    return vector;
  }

  private assertDimensions(vector: number[]): void {
    if (vector.length !== this.dimensions) {
      throw new Error(
        `Embedding dimension mismatch: model returned ${vector.length}, ` +
          `but the DB column and EMBEDDING_DIMENSIONS expect ${this.dimensions}. ` +
          `Either change EMBEDDING_DIMENSIONS and run a migration, or use a model with ${this.dimensions} dims.`,
      );
    }
  }

  private async generateOllama(text: string): Promise<number[]> {
    try {
      const response = await this.ollama.embeddings({
        model: this.ollamaEmbeddingModel,
        prompt: text,
      });
      return response.embedding;
    } catch (error: any) {
      const message = String(error?.message || error);
      if (message.includes('/api/embeddings') && message.includes('not found')) {
        try {
          return await this.generateOllamaV1Compatible(text);
        } catch {
          return this.generateLocalOllama(text);
        }
      }
      this.logger.error(`Ollama embedding failed: ${message}`);
      throw new ServiceUnavailableException(
        `Failed to generate embedding. Is Ollama running with ${this.ollamaEmbeddingModel}?`,
      );
    }
  }

  /**
   * Some hosted Ollama-compatible endpoints only expose OpenAI-style `/v1/embeddings`.
   * Fallback to this format when native `/api/embeddings` is unavailable.
   */
  private async generateOllamaV1Compatible(text: string): Promise<number[]> {
    const nativeHost = normalizeOllamaNativeHost(this.ollamaHost).replace(/\/+$/, '');
    const url = `${nativeHost}/v1/embeddings`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.ollamaApiKey) {
      headers.Authorization = `Bearer ${this.ollamaApiKey}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.ollamaEmbeddingModel,
        input: text,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      this.logger.error(`Ollama v1 embedding fallback failed: ${body}`);
      throw new ServiceUnavailableException(
        `Failed to generate embedding. Is Ollama running with ${this.ollamaEmbeddingModel}?`,
      );
    }

    const json = (await res.json()) as { data?: Array<{ embedding?: number[] }> };
    const embedding = json.data?.[0]?.embedding;
    if (!Array.isArray(embedding)) {
      throw new ServiceUnavailableException(
        `Failed to generate embedding. Is Ollama running with ${this.ollamaEmbeddingModel}?`,
      );
    }
    return embedding;
  }

  private async generateLocalOllama(text: string): Promise<number[]> {
    if (!this.localOllama) {
      throw new ServiceUnavailableException(
        `Failed to generate embedding. Is Ollama running with ${this.ollamaEmbeddingModel}?`,
      );
    }
    const response = await this.localOllama.embeddings({
      model: this.ollamaEmbeddingModel,
      prompt: text,
    });
    return response.embedding;
  }

  private async generateOpenAI(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
      dimensions: this.dimensions,
    });
    return response.data[0].embedding;
  }

  private async generateGoogle(text: string): Promise<number[]> {
    const apiKey = this.config.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new ServiceUnavailableException('Google API key not configured');
    }

    try {
      // Use gemini-embedding-001 via REST API with explicit outputDimensionality
      // The @google/generative-ai SDK is deprecated, using REST API directly is more reliable
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            parts: [{ text }],
          },
          outputDimensionality: this.dimensions, // Specify exact dimensions (768)
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API returned ${response.status}: ${errorBody}`);
      }

      const data = (await response.json()) as {
        embedding?: { values?: number[] };
      };

      const embedding = data?.embedding?.values;
      if (!Array.isArray(embedding)) {
        throw new Error('Invalid embedding response from Google API');
      }

      return embedding;
    } catch (error: any) {
      const message = String(error?.message || error);
      this.logger.error(`Google AI embedding failed: ${message}`);
      throw new ServiceUnavailableException(
        `Failed to generate embedding using Google Gemini: ${message}`,
      );
    }
  }
}
