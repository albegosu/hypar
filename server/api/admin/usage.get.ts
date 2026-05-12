import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/admin-auth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const rows = await prisma.query.groupBy({
    by: ['userId'],
    _count: { id: true },
    _avg: { latencyMs: true },
    orderBy: { _count: { id: 'desc' } },
  })

  const userIds = rows.map((r) => r.userId).filter(Boolean) as string[]
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  })
  const userMap = new Map(users.map((u) => [u.id, u]))

  return rows.map((r) => ({
    userId: r.userId,
    name: r.userId ? (userMap.get(r.userId)?.name ?? null) : null,
    email: r.userId ? (userMap.get(r.userId)?.email ?? null) : null,
    queryCount: r._count.id,
    avgLatencyMs: r._avg.latencyMs ?? null,
  }))
})
