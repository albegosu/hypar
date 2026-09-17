import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  return prisma.integrationToken.findMany({
    where: { userId },
    select: { id: true, name: true, createdAt: true, lastUsedAt: true, revokedAt: true },
    orderBy: { createdAt: 'desc' },
  })
})
