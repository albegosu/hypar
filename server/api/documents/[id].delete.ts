import { removeDocument } from '../../utils/documents.service'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const id = getRouterParam(event, 'id')!
  await removeDocument(id, userId)
  setResponseStatus(event, 204)
})
