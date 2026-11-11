import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import { experimentWriteGuard } from '~/utils/embryo-experiments'

const bodySchema = z.object({
  hypothesis: z.string().trim().min(1, 'A hypothesis is required').max(2000),
  method: z.string().trim().min(1, 'Say how it will be tested').max(4000),
})

/** ADR 0012: record a planned experiment. Records are never deleted. */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const id = getRouterParam(event, 'id')!
  const body = await readValidatedBody(event, bodySchema.parse)

  const embryo = await prisma.embryo.findFirst({ where: { id, userId } })
  if (!embryo) {
    throw createError({ statusCode: 404, statusMessage: 'Embryo not found' })
  }
  const blocked = experimentWriteGuard(embryo.state)
  if (blocked) {
    throw createError({ statusCode: 409, statusMessage: blocked })
  }

  return prisma.$transaction(async (tx) => {
    const experiment = await tx.experiment.create({
      data: { embryoId: id, hypothesis: body.hypothesis, method: body.method, createdBy: 'USER' },
    })
    await tx.embryoEvent.create({
      data: {
        embryoId: id,
        type: 'EXPERIMENT_ADDED',
        initiatedBy: 'USER',
        payload: { experimentId: experiment.id },
      },
    })
    return experiment
  })
})
