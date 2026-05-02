import { reprocess } from '../../../utils/documents.service'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  return reprocess(id)
})
