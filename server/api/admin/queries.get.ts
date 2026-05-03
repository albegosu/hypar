import { z } from 'zod'
import { prisma } from '../../utils/prisma'
import { requireAdmin } from '../../utils/admin-auth'

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  userId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const { limit, offset, userId } = await getValidatedQuery(event, querySchema.parse)
  const where = userId?.trim() ? { userId: userId.trim() } : {}

  const [items, total] = await Promise.all([
    prisma.query.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.query.count({ where }),
  ])

  return { total, limit, offset, items }
})
