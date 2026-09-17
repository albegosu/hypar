import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireIntegration } from '~/server/utils/integration-auth'
import { EMBRYO_LIST_INCLUDE } from '~/utils/embryo-lab'
import { safeHttpUrl } from '~/utils/safe-url'
import { MAX_SOURCE_CONTEXT_CHARS } from '~/utils/source-context'

const bodySchema = z.object({
  seed: z.string().trim().min(1).max(10000),
  sourceUrl: z.string().max(2000).optional(),
  sourceRef: z.string().max(2000).optional(),
  sourceTitle: z.string().trim().max(300).optional(),
  sourceContext: z.string().trim().max(MAX_SOURCE_CONTEXT_CHARS).optional(),
})

/**
 * Plants a seed sent by an integration (e.g. second-brain). The seed is the
 * user's own words; what sparked it (link, title, the capture's essence) is
 * kept alongside, never mixed into it.
 * Idempotent on sourceUrl, so a retried delivery doesn't plant a twin; a
 * delivery that brings source details the embryo lacks fills them in.
 */
export default defineEventHandler(async (event) => {
  const { userId, tokenName } = await requireIntegration(event)
  const body = await readValidatedBody(event, bodySchema.parse)
  const sourceUrl = safeHttpUrl(body.sourceUrl)
  const source = {
    sourceRef: body.sourceRef?.trim() || null,
    sourceTitle: body.sourceTitle || null,
    sourceContext: body.sourceContext || null,
  }

  if (sourceUrl) {
    const existing = await prisma.embryo.findFirst({
      where: { userId, sourceUrl },
      include: EMBRYO_LIST_INCLUDE,
    })
    if (existing) {
      const missing = Object.fromEntries(
        Object.entries(source).filter(([key, value]) => value && !existing[key as keyof typeof source]),
      )
      const embryo = Object.keys(missing).length
        ? await prisma.embryo.update({ where: { id: existing.id }, data: missing, include: EMBRYO_LIST_INCLUDE })
        : existing
      return { created: false, embryo }
    }
  }

  const embryo = await prisma.embryo.create({
    data: {
      userId,
      seed: body.seed,
      sourceUrl,
      ...source,
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
