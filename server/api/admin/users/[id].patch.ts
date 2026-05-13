import { z } from 'zod'
import { prisma } from '../../../utils/prisma'
import { requireAdmin } from '../../../utils/admin-auth'

const schema = z.object({
  role: z.string().optional(),
  banned: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')!
  const body = await readValidatedBody(event, schema.parse)

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

  return prisma.user.update({ where: { id }, data: body })
})
