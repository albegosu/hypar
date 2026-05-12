import { prisma } from '../../utils/prisma'
import { requireAuthOrAdminApiKey } from '../../utils/admin-auth'

export default defineEventHandler(async (event) => {
  requireAuthOrAdminApiKey(event)
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, banned: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
})
