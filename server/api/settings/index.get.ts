import { requireSessionUserId } from '~/server/utils/session'
import { getUserSettings } from '~/server/utils/user-settings'
import { researchAvailability } from '~/server/utils/embryo-research'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const [settings, research] = await Promise.all([getUserSettings(userId), researchAvailability(userId)])
  return { ...settings, research }
})
