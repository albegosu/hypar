import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireIntegration } from '~/server/utils/integration-auth'
import { EMBRYO_LIST_INCLUDE } from '~/utils/embryo-lab'
import { safeHttpUrl } from '~/utils/safe-url'

const bodySchema = z.object({
  seed: z.string().trim().min(1).max(10000),
  sourceUrl: z.string().max(2000).optional(),
  sourceRef: z.string().max(2000).optional(),
})

/**
 * Plants a seed sent by an integration (e.g. second-brain). The seed is the
 * user's own words; the source is kept alongside, never mixed into it.
 * Idempotent on sourceUrl, so a retried delivery doesn't plant a twin.
 */
export default defineEventHandler(async (event) => {
  const { userId, tokenName } = await requireIntegration(event)
  const body = await readValidatedBody(event, bodySchema.parse)
  const sourceUrl = safeHttpUrl(body.sourceUrl)
  const sourceRef = body.sourceRef?.trim() || null

  if (sourceUrl) {
    const existing = await prisma.embryo.findFirst({
      where: { userId, sourceUrl },
      include: EMBRYO_LIST_INCLUDE,
    })
    if (existing) {
      return { created: false, embryo: existing }
    }
  }

  const embryo = await prisma.embryo.create({
    data: {
      userId,
      seed: body.seed,
      sourceUrl,
      sourceRef,
      events: {
        create: {
          type: 'CREATED',
          initiatedBy: 'SYSTEM',
          payload: { via: tokenName, sourceUrl },
        },
      },
    },
    include: EMBRYO_LIST_INCLUDE,
  })

  setResponseStatus(event, 201)
  return { created: true, embryo }
})
