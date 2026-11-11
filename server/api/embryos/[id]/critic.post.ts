import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import { logger } from '~/server/utils/logger'
import { criticEmbryo } from '~/server/utils/embryo-critic'
import { dialogueFromEvents } from '~/server/utils/embryo-agent'
import { isClosedState } from '~/utils/embryo-lab'
import { classifyLlmError } from '~/utils/llm-errors'

/**
 * ADR 0011: on-demand critic. Returns typed gate suggestions with confidence, stored as pending
 * notes. Never changes state and never speaks: it is not a second voice (ADR 0006).
 */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const id = getRouterParam(event, 'id')!

  const embryo = await prisma.embryo.findFirst({
    where: { id, userId },
    include: {
      tensions: { where: { resolved: false }, select: { question: true } },
      events: { orderBy: { createdAt: 'asc' }, select: { type: true, payload: true } },
    },
  })
  if (!embryo) throw createError({ statusCode: 404, statusMessage: 'Embryo not found' })
  if (isClosedState(embryo.state)) {
    throw createError({ statusCode: 409, statusMessage: 'Closed embryos cannot receive agent input' })
  }

  try {
    const outcome = await criticEmbryo({
      userId,
      embryo,
      dialogue: dialogueFromEvents(embryo.events).slice(-12),
      openTensions: embryo.tensions.map(t => t.question),
    })
    return {
      count: outcome.suggestions.length,
      skipped: outcome.skipped,
      provider: outcome.label,
      suggestions: outcome.suggestions,
    }
  }
  catch (err) {
    if ((err as { statusCode?: number })?.statusCode === 409) throw err
    const classified = classifyLlmError(err)
    logger.error('embryo critic failed', { embryoId: id, kind: classified.kind, statusCode: classified.statusCode })
    throw createError({
      statusCode: classified.statusCode,
      statusMessage: classified.rawMessage.slice(0, 280) || 'Critic unavailable',
    })
  }
})
