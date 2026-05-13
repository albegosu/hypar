import { deleteConversation } from '../../utils/conversations.service'

export default defineEventHandler(async (event) => {
  requireSessionUserId(event)
  const workspaceId = event.context.workspaceId
  if (!workspaceId) throw createError({ statusCode: 400, statusMessage: 'No active workspace' })
  const id = getRouterParam(event, 'id')!
  await deleteConversation(id, workspaceId)
  setResponseStatus(event, 204)
})
