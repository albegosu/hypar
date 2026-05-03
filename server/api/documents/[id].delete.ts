import { removeDocument } from '../../utils/documents.service'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const userId =
    getHeader(event, 'x-user-id') ||
    (getQuery(event).userId as string | undefined)
  await removeDocument(id, userId)
  setResponseStatus(event, 204)
})
