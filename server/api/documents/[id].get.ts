import { findOne } from '../../utils/documents.service'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const id = getRouterParam(event, 'id')!
  const doc = await findOne(id)
  if (doc.userId && doc.userId !== userId) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return doc
})
