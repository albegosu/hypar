import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'

/** Clears the snapshot. The next push from second-brain creates it again. */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const { count } = await prisma.referenceIndex.deleteMany({ where: { userId } })
  return { cleared: count > 0 }
})
