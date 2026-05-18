import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  BETTER_AUTH_SECRET: z.string().min(16).optional(),
  AUTH_SECRET: z.string().min(16).optional(),
  EMBEDDING_PROVIDER: z.string().optional(),
  GOOGLE_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  VOYAGE_API_KEY: z.string().optional(),
  OLLAMA_URL: z.string().optional(),
})

function hasEmbeddingProvider(env: z.infer<typeof envSchema>): boolean {
  const provider = env.EMBEDDING_PROVIDER?.trim().toLowerCase()
  if (provider === 'gemini' || provider === 'google') return Boolean(env.GOOGLE_API_KEY?.trim())
  if (provider === 'openai') return Boolean(env.OPENAI_API_KEY?.trim())
  if (provider === 'voyage') return Boolean(env.VOYAGE_API_KEY?.trim())
  if (provider === 'ollama') return Boolean(env.OLLAMA_URL?.trim())
  return Boolean(
    env.GOOGLE_API_KEY?.trim()
    || env.OPENAI_API_KEY?.trim()
    || env.VOYAGE_API_KEY?.trim()
    || env.OLLAMA_URL?.trim(),
  )
}

/** Validates required environment variables. Throws on failure. */
export function validateEnv(): void {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    throw new Error(`[env] Invalid environment: ${parsed.error.message}`)
  }

  const env = parsed.data
  const isProd = env.NODE_ENV === 'production'

  if (!env.DATABASE_URL?.trim()) {
    throw new Error('[env] DATABASE_URL is required')
  }

  const authSecret = env.BETTER_AUTH_SECRET?.trim() || env.AUTH_SECRET?.trim()
  if (!authSecret) {
    throw new Error('[env] BETTER_AUTH_SECRET or AUTH_SECRET is required (min 16 chars)')
  }

  if (!hasEmbeddingProvider(env)) {
    throw new Error(
      '[env] Configure at least one embedding provider: GOOGLE_API_KEY, OPENAI_API_KEY, VOYAGE_API_KEY, or OLLAMA_URL',
    )
  }

  if (isProd && authSecret.length < 32) {
    console.warn('[env] Production auth secret should be at least 32 characters (openssl rand -hex 32)')
  }
}
