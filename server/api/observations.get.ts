import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import { aggregateObservations } from '~/server/utils/observations'

/**
 * Research signals over the user's own garden: move × state, path fill rate in
 * GROWING, and agent-connection accept rate. Backs the Validation column of the
 * lab roadmap. Session-scoped — each user sees only their own events.
 */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)

  const [events, embryoCount] = await Promise.all([
    prisma.embryoEvent.findMany({
      where: {
        embryo: { userId },
        type: { in: ['AGENT_QUESTION', 'AGENT_SUGGESTION', 'CONNECTION_MADE'] },
      },
      select: { type: true, payload: true },
    }),
    prisma.embryo.count({ where: { userId } }),
  ])

  return aggregateObservations(events, { embryoCount })
})
