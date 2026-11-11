import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import { DEFAULT_USER_SETTINGS, PEER_LIMIT_MAX, getUserSettings } from '~/server/utils/user-settings'
import { researchAvailability } from '~/server/utils/embryo-research'

const bodySchema = z.object({
  webResearch: z.boolean().optional(),
  autoResearch: z.boolean().optional(),
  autoEngage: z.boolean().optional(),
  peerLimit: z.number().int().min(0).max(PEER_LIMIT_MAX).optional(),
}).strict()

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const body = await readValidatedBody(event, bodySchema.parse)
  await prisma.userSettings.upsert({
    where: { userId },
    create: { userId, ...DEFAULT_USER_SETTINGS, ...body },
    update: body,
  })
  const [settings, research] = await Promise.all([getUserSettings(userId), researchAvailability(userId)])
  return { ...settings, research }
})
