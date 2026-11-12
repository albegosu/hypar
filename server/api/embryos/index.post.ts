import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import { EMBRYO_LIST_INCLUDE } from '~/utils/embryo-lab'
import { safeHttpUrl } from '~/utils/safe-url'

const bodySchema = z.object({
  seed: z.string().min(1).max(10000),
  /** Set when the seed was confirmed from a capture (link or image); stored beside the seed, never in it. */
  sourceUrl: z.string().max(2000).optional(),
  sourceTitle: z.string().trim().max(300).optional(),
})

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const { seed, sourceUrl: rawUrl, sourceTitle } = await readValidatedBody(event, bodySchema.parse)

  const sourceUrl = safeHttpUrl(rawUrl)
  const embryo = await prisma.embryo.create({
    data: {
      userId,
      seed,
      sourceUrl,
      sourceTitle: sourceTitle || null,
      events: {
        create: {
          type: 'CREATED',
          initiatedBy: 'USER',
          ...(sourceUrl || sourceTitle ? { payload: { via: 'capture', ...(sourceUrl ? { sourceUrl } : {}) } } : {}),
        },
      },
    },
    include: EMBRYO_LIST_INCLUDE,
  })

  return embryo
})
