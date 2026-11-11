import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import {
  EXPERIMENT_VERDICTS,
  experimentActionGuard,
  experimentWriteGuard,
  normalizeEvidence,
} from '~/utils/embryo-experiments'

const bodySchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('start') }),
  z.object({
    action: z.literal('conclude'),
    result: z.string().trim().min(1, 'A result is required').max(4000),
    verdict: z.enum(EXPERIMENT_VERDICTS),
    evidence: z.array(z.object({ note: z.string(), url: z.string().optional() })).max(10).optional(),
  }),
  z.object({
    action: z.literal('supersede'),
    reason: z.string().trim().min(1, 'A reason is required to supersede an experiment').max(2000),
    supersededById: z.string().optional(),
  }),
])

/** ADR 0012: start, conclude or supersede an experiment. There is no delete. */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const id = getRouterParam(event, 'id')!
  const expId = getRouterParam(event, 'expId')!
  const body = await readValidatedBody(event, bodySchema.parse)

  const embryo = await prisma.embryo.findFirst({ where: { id, userId } })
  if (!embryo) {
    throw createError({ statusCode: 404, statusMessage: 'Embryo not found' })
  }
  const blocked = experimentWriteGuard(embryo.state)
  if (blocked) {
    throw createError({ statusCode: 409, statusMessage: blocked })
  }
  const experiment = await prisma.experiment.findFirst({ where: { id: expId, embryoId: id } })
  if (!experiment) {
    throw createError({ statusCode: 404, statusMessage: 'Experiment not found' })
  }
  const invalid = experimentActionGuard(experiment.status, body.action)
  if (invalid) {
    throw createError({ statusCode: 409, statusMessage: invalid })
  }

  if (body.action === 'start') {
    return prisma.$transaction(async (tx) => {
      const updated = await tx.experiment.update({ where: { id: expId }, data: { status: 'RUNNING' } })
      await tx.embryoEvent.create({
        data: { embryoId: id, type: 'EXPERIMENT_UPDATED', initiatedBy: 'USER', payload: { experimentId: expId, to: 'RUNNING' } },
      })
      return updated
    })
  }

  if (body.action === 'conclude') {
    const evidence = normalizeEvidence(body.evidence)
    return prisma.$transaction(async (tx) => {
      const updated = await tx.experiment.update({
        where: { id: expId },
        data: {
          status: 'CONCLUDED',
          result: body.result,
          verdict: body.verdict,
          evidence,
          concludedAt: new Date(),
        },
      })
      await tx.embryoEvent.create({
        data: {
          embryoId: id,
          type: 'EXPERIMENT_UPDATED',
          initiatedBy: 'USER',
          payload: { experimentId: expId, to: 'CONCLUDED', verdict: body.verdict },
        },
      })
      return updated
    })
  }

  if (body.supersededById) {
    const replacement = await prisma.experiment.findFirst({
      where: { id: body.supersededById, embryoId: id },
      select: { id: true },
    })
    if (!replacement || replacement.id === expId) {
      throw createError({ statusCode: 400, statusMessage: 'Replacement experiment not found' })
    }
  }
  return prisma.$transaction(async (tx) => {
    const updated = await tx.experiment.update({
      where: { id: expId },
      data: {
        status: 'SUPERSEDED',
        supersededAt: new Date(),
        supersededReason: body.reason,
        supersededById: body.supersededById ?? null,
      },
    })
    await tx.embryoEvent.create({
      data: {
        embryoId: id,
        type: 'EXPERIMENT_SUPERSEDED',
        initiatedBy: 'USER',
        payload: { experimentId: expId, reason: body.reason, previousStatus: experiment.status },
      },
    })
    return updated
  })
})
