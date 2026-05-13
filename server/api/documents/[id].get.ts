import { findOne } from '../../utils/documents.service'

export default defineEventHandler(async (event) => {
  requireSessionUserId(event)
  const workspaceId = event.context.workspaceId
  if (!workspaceId) throw createError({ statusCode: 400, statusMessage: 'No active workspace' })
  const id = getRouterParam(event, 'id')!
  const doc = await findOne(id)
  if (doc.workspaceId !== workspaceId) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return doc
})
