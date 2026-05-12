import { deleteConversation } from '../../utils/conversations.service'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const id = getRouterParam(event, 'id')!
  await deleteConversation(id, userId)
  setResponseStatus(event, 204)
})
