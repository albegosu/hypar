import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'

/** Experiment records of an embryo, oldest first. Readable in every state, closed ones included. */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const id = getRouterParam(event, 'id')!
  const embryo = await prisma.embryo.findFirst({ where: { id, userId }, select: { id: true } })
  if (!embryo) {
    throw createError({ statusCode: 404, statusMessage: 'Embryo not found' })
  }
  return prisma.experiment.findMany({ where: { embryoId: id }, orderBy: { createdAt: 'asc' } })
})
