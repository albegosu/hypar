import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const id = getRouterParam(event, 'id')!

  const { count } = await prisma.integrationToken.updateMany({
    where: { id, userId, revokedAt: null },
    data: { revokedAt: new Date() },
  })
  if (count === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Token not found or already revoked' })
  }
  return { revoked: true }
})
