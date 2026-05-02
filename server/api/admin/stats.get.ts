import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const [docs, chunks, queries, avgLatency] = await Promise.all([
    prisma.document.count(),
    prisma.chunk.count(),
    prisma.query.count(),
    prisma.query.aggregate({ _avg: { latencyMs: true } }),
  ])

  return {
    documents: docs,
    chunks,
    queries,
    avgLatencyMs: avgLatency._avg.latencyMs ?? null,
  }
})
