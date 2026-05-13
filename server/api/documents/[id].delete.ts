import { removeDocument } from '../../utils/documents.service'

export default defineEventHandler(async (event) => {
  requireSessionUserId(event)
  const workspaceId = event.context.workspaceId
  if (!workspaceId) throw createError({ statusCode: 400, statusMessage: 'No active workspace' })
  const id = getRouterParam(event, 'id')!
  await removeDocument(id, workspaceId)
  setResponseStatus(event, 204)
})
