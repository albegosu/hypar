import { requireSessionUserId } from '~/server/utils/session'
import { providerSettingsView } from '~/server/utils/provider-connection'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  return providerSettingsView(userId)
})
