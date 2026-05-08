import { prisma } from './prisma'

const CACHE_TTL_MS = 60_000

interface CacheEntry {
  value: string
  expiresAt: number
}

// In-memory cache. Single-process safe; for multi-instance deployments, reduce TTL.
const cache = new Map<string, CacheEntry>()

function fromCache(key: string): string | undefined {
  const entry = cache.get(key)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return undefined
  }
  return entry.value
}

function toCache(key: string, value: string): void {
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS })
}

export function invalidateCache(key?: string): void {
  if (key) cache.delete(key)
  else cache.clear()
}

export async function getSetting(key: string, fallback: string): Promise<string> {
  const cached = fromCache(key)
  if (cached !== undefined) return cached

  try {
    const row = await prisma.setting.findUnique({ where: { key } })
    // Empty string means "reset to env/default" — treat as not set
    const value = row?.value ? row.value : fallback
    toCache(key, value)
    return value
  } catch {
    return fallback
  }
}

export async function getSettings(category: string): Promise<Record<string, string>> {
  try {
    const rows = await prisma.setting.findMany({ where: { category } })
    const result: Record<string, string> = {}
    for (const row of rows) {
      result[row.key] = row.value
      toCache(row.key, row.value)
    }
    return result
  } catch {
    return {}
  }
}

export async function upsertSetting(key: string, value: string, category: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value, category },
    create: { key, value, category },
  })
  toCache(key, value)
}

export function getNumericSetting(value: string, fallback: number): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function getBoolSetting(value: string, fallback: boolean): boolean {
  if (value === 'true') return true
  if (value === 'false') return false
  return fallback
}
