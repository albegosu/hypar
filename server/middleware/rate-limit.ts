/**
 * Token-bucket rate limiter, in-memory. Per (ip + userId) key.
 * Sufficient for single-instance MVP. For multi-instance, replace with Redis.
 */
import type { H3Event } from 'h3'

interface Bucket {
  tokens: number
  lastRefill: number
}

interface Rule {
  test: (path: string, method: string) => boolean
  capacity: number
  refillPerSec: number
  label: string
}

const RULES: Rule[] = [
  {
    label: 'agent',
    test: (p, m) => m === 'POST' && /\/api\/embryos\/[^/]+\/agent$/.test(p),
    capacity: 30,
    refillPerSec: 30 / 60,
  },
  {
    label: 'embryo-write',
    test: (p, m) =>
      (m === 'POST' || m === 'PATCH')
      && (p === '/api/embryos' || /^\/api\/embryos\/[^/]+(\/(fossilize|resurrect))?$/.test(p)),
    capacity: 60,
    refillPerSec: 60 / 60,
  },
  {
    label: 'integration',
    test: (p, m) => (m === 'POST' || m === 'PUT') && p.startsWith('/api/integrations/') && !p.startsWith('/api/integrations/tokens'),
    capacity: 30,
    refillPerSec: 30 / 60,
  },
  {
    // Public, unauthenticated telemetry beacons — cap so they can't flood logs/metrics.
    label: 'telemetry',
    test: (p, m) => m === 'POST' && (p === '/api/vitals' || p === '/api/client-errors'),
    capacity: 60,
    refillPerSec: 60 / 60,
  },
]

const buckets = new Map<string, Bucket>()

/**
 * A bucket idle longer than this has refilled to full capacity for every rule
 * (all refill within `capacity/refillPerSec` ≤ 60s), so dropping it is
 * equivalent to recreating it on the next hit. Keeps the map from growing
 * unbounded with one entry per distinct IP.
 */
const BUCKET_TTL_MS = 10 * 60_000
const SWEEP_INTERVAL_MS = 60_000
let lastSweep = Date.now()

function sweepIdleBuckets(now: number): void {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return
  lastSweep = now
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastRefill > BUCKET_TTL_MS) buckets.delete(key)
  }
}

function clientKey(event: H3Event): string {
  const xff = getHeader(event, 'x-forwarded-for') ?? ''
  const ip = xff.split(',')[0].trim() || event.node.req.socket?.remoteAddress || 'unknown'
  const userId = event.context.auth?.user?.id ?? 'anon'
  return `${ip}|${userId}`
}

function take(rule: Rule, key: string): boolean {
  const now = Date.now()
  const k = `${rule.label}|${key}`
  const b = buckets.get(k) ?? { tokens: rule.capacity, lastRefill: now }
  const elapsedSec = (now - b.lastRefill) / 1000
  const refill = elapsedSec * rule.refillPerSec
  b.tokens = Math.min(rule.capacity, b.tokens + refill)
  b.lastRefill = now
  if (b.tokens < 1) {
    buckets.set(k, b)
    return false
  }
  b.tokens -= 1
  buckets.set(k, b)
  return true
}

export default defineEventHandler((event) => {
  const path = event.path ?? ''
  const method = event.method ?? 'GET'
  if (!path.startsWith('/api/')) return

  const matched = RULES.find(r => r.test(path, method))
  if (!matched) return

  sweepIdleBuckets(Date.now())
  const ok = take(matched, clientKey(event))
  if (!ok) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Rate limit exceeded. Please slow down.',
    })
  }
})
