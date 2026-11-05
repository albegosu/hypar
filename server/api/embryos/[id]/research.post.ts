import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import { logger } from '~/server/utils/logger'
import { researchEmbryo } from '~/server/utils/embryo-research'
import { dialogueFromEvents } from '~/server/utils/embryo-agent'
import { isClosedState } from '~/utils/embryo-lab'
import { classifyLlmError } from '~/utils/llm-errors'

/** ADR 0007: search the web to refute and extend this idea; findings land as sourced tensions. */
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
    throw createError({ statusCode: 409, statusMessage: 'Closed embryos cannot be researched' })
  }

  try {
    const outcome = await researchEmbryo({
      userId,
      embryo,
      dialogue: dialogueFromEvents(embryo.events).slice(-12),
      openTensions: embryo.tensions.map(t => t.question),
      auto: false,
      timeoutMs: Number(useRuntimeConfig().ollamaChatTimeoutMs) || 180_000,
    })
    return { count: outcome.findings.length, provider: outcome.label, tensionIds: outcome.tensionIds }
  }
  catch (err) {
    if ((err as { statusCode?: number })?.statusCode === 409) throw err
    const classified = classifyLlmError(err)
    logger.error('embryo research failed', { embryoId: id, kind: classified.kind, statusCode: classified.statusCode })
    let message = classified.rawMessage.slice(0, 280) || 'Research failed'
    if (classified.kind === 'unauthorized') {
      const own = await prisma.providerConnection.count({ where: { userId } })
      message = own
        ? 'The provider rejected your key. Update it in Settings.'
        : 'Ollama Cloud rejected the server key. Check OLLAMA_API_KEY, or connect your own provider in Settings.'
    }
    throw createError({ statusCode: classified.statusCode, statusMessage: message })
  }
})
