/**
 * Optional Redis-backed sliding window for multi-instance rate limiting.
 * Falls back to in-memory when REDIS_URL is unset.
 */

type RedisClient = {
  connect(): Promise<void>
  zRemRangeByScore(key: string, min: number, max: number): Promise<number>
  zAdd(key: string, members: { score: number; value: string }): Promise<number>
  zCard(key: string): Promise<number>
  expire(key: string, seconds: number): Promise<boolean>
  quit(): Promise<void>
}

let redisClient: RedisClient | null | undefined

async function getRedis(): Promise<RedisClient | null> {
  const url = process.env.REDIS_URL?.trim()
  if (!url) return null
  if (redisClient !== undefined) return redisClient

  try {
    const { createClient } = await import('redis')
    const client = createClient({ url }) as unknown as RedisClient
    await client.connect()
    redisClient = client
    return client
  } catch {
    redisClient = null
    return null
  }
}

const memoryWindows = new Map<string, number[]>()

/**
 * Returns true if the request is allowed, false if rate limited.
 */
export async function slidingWindowAllow(
  key: string,
  windowMs: number,
  limit: number,
): Promise<boolean> {
  const redis = await getRedis()
  const now = Date.now()
  const cutoff = now - windowMs

  if (redis) {
    const redisKey = `rl:${key}`
    await redis.zRemRangeByScore(redisKey, 0, cutoff)
    await redis.zAdd(redisKey, { score: now, value: `${now}:${Math.random()}` })
    const count = await redis.zCard(redisKey)
    await redis.expire(redisKey, Math.ceil(windowMs / 1000) + 1)
    return count <= limit
  }

  const hits = memoryWindows.get(key) ?? []
  const recent = hits.filter((t) => t > cutoff)
  recent.push(now)
  memoryWindows.set(key, recent)
  return recent.length <= limit
}
