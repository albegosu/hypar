import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'

const bodySchema = z.object({
  // How the first-confrontation notice was left: its own button, a reply or a skip.
  via: z.enum(['continue', 'reply', 'skip']),
  // How long it was on screen. Short = dismissed without reading (invite vs auto-engage, #154).
  visibleMs: z.number().int().min(0).max(24 * 60 * 60 * 1000),
})

/** Logs that the user left the germination notice. Measurement only; changes no state. */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const id = getRouterParam(event, 'id')!
  const { via, visibleMs } = await readValidatedBody(event, bodySchema.parse)

  const embryo = await prisma.embryo.findFirst({ where: { id, userId }, select: { state: true } })
  if (!embryo) {
    throw createError({ statusCode: 404, statusMessage: 'Embryo not found' })
  }
  if (embryo.state === 'FOSSIL' || embryo.state === 'TRANSPLANTED') {
    throw createError({ statusCode: 409, statusMessage: 'Closed embryos take no further events' })
  }

  await prisma.embryoEvent.create({
    data: { embryoId: id, type: 'GERMINATE_NOTICE', initiatedBy: 'USER', payload: { via, visibleMs } },
  })
  return { ok: true }
})
