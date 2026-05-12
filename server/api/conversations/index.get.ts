import { listConversations } from '../../utils/conversations.service'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  return { items: await listConversations(userId) }
})
