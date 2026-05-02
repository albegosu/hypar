import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Math.max(Number(query.limit ?? 50), 1), 200)
  const offset = Math.max(Number(query.offset ?? 0), 0)

  const [items, total] = await Promise.all([
    prisma.query.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.query.count(),
  ])

  return { total, limit, offset, items }
})
