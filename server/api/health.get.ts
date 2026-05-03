import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const checks: Record<string, boolean> = { db: false, embedding: false }

  try {
    await prisma.$queryRaw`SELECT 1`
    checks.db = true
  } catch {}

  try {
    const cfg = useRuntimeConfig()
    await $fetch(`${cfg.ollamaUrl}/api/tags`, { timeout: 3000 } as Parameters<typeof $fetch>[1])
    checks.embedding = true
  } catch {}

  const ok = checks.db
  if (!ok) setResponseStatus(event, 503)
  return { status: ok ? 'ok' : 'degraded', checks, ts: new Date().toISOString() }
})
