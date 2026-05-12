import { getConversation } from '../../utils/conversations.service'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const id = getRouterParam(event, 'id')!
  return getConversation(id, userId)
})
