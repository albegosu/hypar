import { createCipheriv, createDecipheriv, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { prisma } from './prisma.ts'

const CACHE_TTL_MS = 60_000

// Keys whose values are encrypted when stored in UserSetting
export const SECRET_SETTING_KEYS = new Set([
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'GOOGLE_API_KEY',
  'MISTRAL_API_KEY',
  'OLLAMA_API_KEY',
  'VOYAGE_API_KEY',
  'DB_PASSWORD',
])

/** Global Setting rows that must be encrypted at rest. */
export const GLOBAL_SECRET_SETTING_KEYS = new Set([
  ...SECRET_SETTING_KEYS,
  'DATABASE_URL',
  'wizard.state',
])

export function getAuthSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim() || ''
  if (secret) return secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[settings] BETTER_AUTH_SECRET or AUTH_SECRET is required in production')
  }
  return 'dev-secret-local-only-not-for-production'
}

function getEncryptionKey(): Buffer {
  return scryptSync(getAuthSecret(), 'user-settings-salt', 32) as Buffer
}

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(12)
  const key = getEncryptionKey()
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, encrypted]).toString('base64')
}

export function decryptSecret(ciphertext: string): string {
  try {
    const buf = Buffer.from(ciphertext, 'base64')
    const iv = buf.subarray(0, 12)
    const tag = buf.subarray(12, 28)
    const encrypted = buf.subarray(28)
    const key = getEncryptionKey()
    const decipher = createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(tag)
    return decipher.update(encrypted) + decipher.final('utf8')
  } catch {
    return ''
  }
}

function resolveStoredValue(row: { value: string; encrypted: boolean }): string {
  if (!row.value) return ''
  return row.encrypted ? decryptSecret(row.value) : row.value
}

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
    const value = row?.value ? resolveStoredValue(row) : (process.env[key] || fallback)
    toCache(key, value)
    return value
  } catch {
    return process.env[key] || fallback
  }
}

export async function getSettings(category: string): Promise<Record<string, string>> {
  try {
    const rows = await prisma.setting.findMany({ where: { category } })
    const result: Record<string, string> = {}
    for (const row of rows) {
      const value = resolveStoredValue(row)
      result[row.key] = value
      toCache(row.key, value)
    }
    return result
  } catch {
    return {}
  }
}

export async function upsertSetting(key: string, value: string, category: string): Promise<void> {
  const shouldEncrypt = GLOBAL_SECRET_SETTING_KEYS.has(key) && value.length > 0
  const storedValue = shouldEncrypt ? encryptSecret(value) : value
  await prisma.setting.upsert({
    where: { key },
    update: { value: storedValue, category, encrypted: shouldEncrypt },
    create: { key, value: storedValue, category, encrypted: shouldEncrypt },
  })
  if (value) toCache(key, value)
  else invalidateCache(key)
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

/**
 * Resolves a setting with per-user override support.
 * Resolution order: UserSetting → global Setting → env → fallback
 */
export async function getEffectiveSetting(key: string, userId: string, fallback = ''): Promise<string> {
  try {
    const userRow = await prisma.userSetting.findUnique({ where: { userId_key: { userId, key } } })
    if (userRow?.value) {
      return userRow.encrypted ? decryptSecret(userRow.value) : userRow.value
    }
  } catch {
    // fall through to global
  }
  return getSetting(key, fallback)
}

export async function upsertUserSetting(userId: string, key: string, value: string, category: string): Promise<void> {
  const shouldEncrypt = SECRET_SETTING_KEYS.has(key)
  const storedValue = shouldEncrypt ? encryptSecret(value) : value
  await prisma.userSetting.upsert({
    where: { userId_key: { userId, key } },
    update: { value: storedValue, category, encrypted: shouldEncrypt },
    create: { userId, key, value: storedValue, category, encrypted: shouldEncrypt },
  })
}

export async function deleteUserSetting(userId: string, key: string): Promise<void> {
  await prisma.userSetting.deleteMany({ where: { userId, key } })
}

export async function getUserSettings(userId: string, category: string): Promise<Record<string, string>> {
  const rows = await prisma.userSetting.findMany({ where: { userId, category } })
  const result: Record<string, string> = {}
  for (const row of rows) {
    result[row.key] = row.encrypted ? decryptSecret(row.value) : row.value
  }
  return result
}

/** Constant-time comparison for API keys. */
export function safeCompareStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    return false
  }
}
