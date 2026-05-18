import type { H3Event } from 'h3'
import { prisma } from './prisma'
import { slidingWindowAllow } from './distributed-store'

// In-memory cache: userId → whether they have their own LLM key (TTL 5 min)
const ownKeyCache = new Map<string, { value: boolean; expiresAt: number }>()

function getDefaultLimit(): number {
  const env = process.env.RATE_LIMIT_PER_MIN
  const n = parseInt(env ?? '', 10)
  return Number.isFinite(n) && n > 0 ? n : 30
}

// LLM provider key names — having any of these means the user pays for their own calls
const LLM_KEY_SETTINGS = ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GOOGLE_API_KEY', 'MISTRAL_API_KEY', 'OLLAMA_API_KEY']

async function userHasOwnLlmKey(userId: string): Promise<boolean> {
  const cached = ownKeyCache.get(userId)
  if (cached && cached.expiresAt > Date.now()) return cached.value

  const row = await prisma.userSetting.findFirst({
    where: { userId, key: { in: LLM_KEY_SETTINGS }, value: { not: '' } },
    select: { key: true },
  }).catch(() => null)

  const value = Boolean(row)
  ownKeyCache.set(userId, { value, expiresAt: Date.now() + 5 * 60_000 })
  return value
}

/** Invalidate the own-key cache for a user (call after they update settings). */
export function invalidateRateLimitCache(userId: string): void {
  ownKeyCache.delete(userId)
}

/**
 * Sliding-window rate limiter keyed by userId.
 * Throws 429 when the user exceeds perMinute requests in the last 60 seconds.
 * Exempt: admins, and users who have configured their own LLM API key.
 */
export async function enforceRateLimit(
  event: H3Event,
  { perMinute = getDefaultLimit() }: { perMinute?: number } = {},
): Promise<void> {
  const user = event.context.auth?.user
  if (!user) return
  if (user.role === 'admin') return

  // Users using their own keys are exempt — they pay for their own calls
  if (await userHasOwnLlmKey(user.id)) return

  const allowed = await slidingWindowAllow(`user:${user.id}`, 60_000, perMinute)
  if (!allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: `Rate limit exceeded. Max ${perMinute} requests per minute. Add your own API key in Settings to remove this limit.`,
    })
  }
}
