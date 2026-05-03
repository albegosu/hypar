import { Prisma } from '@prisma/client'
import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/admin-auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const [
    docs,
    chunks,
    queries,
    avgLatency,
    toolCalledQueries,
    docsByStatus,
    percentiles,
  ] = await Promise.all([
    prisma.document.count(),
    prisma.chunk.count(),
    prisma.query.count(),
    prisma.query.aggregate({ _avg: { latencyMs: true } }),
    prisma.query.count({ where: { toolCalled: true } }),
    prisma.$queryRaw<Array<{ status: string; count: bigint }>>(Prisma.sql`
      SELECT "ingestStatus" AS status, COUNT(*)::bigint AS count
      FROM "Document" GROUP BY "ingestStatus"
    `),
    prisma.$queryRaw<Array<{ p50: number | null; p95: number | null }>>(Prisma.sql`
      SELECT
        PERCENTILE_CONT(0.5)  WITHIN GROUP (ORDER BY "latencyMs") AS p50,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY "latencyMs") AS p95
      FROM "Query"
      WHERE "latencyMs" IS NOT NULL
    `),
  ])

  const documentsByStatus = Object.fromEntries(
    docsByStatus.map((r) => [r.status, Number(r.count)]),
  )

  return {
    documents: docs,
    chunks,
    queries,
    avgLatencyMs: avgLatency._avg.latencyMs ?? null,
    p50LatencyMs: percentiles[0]?.p50 ?? null,
    p95LatencyMs: percentiles[0]?.p95 ?? null,
    toolCallRate: queries > 0 ? toolCalledQueries / queries : 0,
    documentsByStatus,
  }
})
