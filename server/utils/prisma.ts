import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { databasePoolConfig } from '~/utils/database-config'

declare global {
  var __prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg(databasePoolConfig(process.env))
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])
}

/**
 * Lazy proxy: defers PrismaClient instantiation until the first property
 * access. This lets test files import modules that depend on `prisma`
 * without requiring DATABASE_URL.
 */
function getOrCreate(): PrismaClient {
  if (!globalThis.__prisma) globalThis.__prisma = createPrismaClient()
  return globalThis.__prisma
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getOrCreate() as unknown as Record<string | symbol, unknown>
    const value = client[prop]
    return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(client) : value
  },
}) as PrismaClient
