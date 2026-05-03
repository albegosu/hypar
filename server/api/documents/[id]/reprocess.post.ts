import { reprocessDocument } from '../../../utils/documents.service'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const { runId } = await reprocessDocument(id)
  return { documentId: id, runId, status: 'processing' }
})
