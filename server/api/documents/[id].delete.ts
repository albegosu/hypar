import { removeDocument } from '../../utils/documents.service'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  await removeDocument(id)
  setResponseStatus(event, 204)
})
