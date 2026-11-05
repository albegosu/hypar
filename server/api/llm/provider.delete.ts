import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import { providerSettingsView } from '~/server/utils/provider-connection'

/** Forget the user's provider and key; the agent goes back to the server fallback. */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  await prisma.providerConnection.deleteMany({ where: { userId } })
  return providerSettingsView(userId)
})
