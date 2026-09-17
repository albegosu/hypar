import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import { countReferenceTopics } from '~/utils/reference-index'

/** What Settings shows about the snapshot. The markdown itself stays on the server. */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const row = await prisma.referenceIndex.findUnique({
    where: { userId },
    select: { markdown: true, commit: true, updatedAt: true },
  })
  if (!row) return null
  return {
    updatedAt: row.updatedAt,
    commit: row.commit,
    topics: countReferenceTopics(row.markdown),
    chars: row.markdown.length,
  }
})
