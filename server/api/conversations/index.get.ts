import { listConversations } from '../../utils/conversations.service'

export default defineEventHandler(async (event) => {
  requireSessionUserId(event)
  const workspaceId = event.context.workspaceId
  if (!workspaceId) throw createError({ statusCode: 400, statusMessage: 'No active workspace' })
  return { items: await listConversations(workspaceId) }
})
