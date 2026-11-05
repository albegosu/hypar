import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import { transplantGuard } from '~/utils/embryo-lab'

const bodySchema = z.object({
  reason: z.string().trim().min(1, 'A reason is required to transplant an embryo').max(2000),
  outcome: z.string().trim().min(1, 'Say what it became: a link or a reference').max(2000),
})

/** ADR 0005: a MATURING idea that works leaves the garden, with what it became and why it worked. */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const id = getRouterParam(event, 'id')!
  const { reason, outcome } = await readValidatedBody(event, bodySchema.parse)

  const embryo = await prisma.embryo.findFirst({ where: { id, userId } })
  if (!embryo) {
    throw createError({ statusCode: 404, statusMessage: 'Embryo not found' })
  }
  const blocked = transplantGuard(embryo.state)
  if (blocked) {
    throw createError({ statusCode: 409, statusMessage: blocked })
  }

  return prisma.embryo.update({
    where: { id },
    data: {
      state: 'TRANSPLANTED',
      transplantedAt: new Date(),
      transplantReason: reason,
      transplantOutcome: outcome,
      events: {
        create: {
          type: 'TRANSPLANTED',
          initiatedBy: 'USER',
          payload: { reason, outcome, previousState: embryo.state },
        },
      },
    },
  })
})
