import { reprocessDocument } from '../../../utils/documents.service'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const id = getRouterParam(event, 'id')!

  const doc = await prisma.document.findUnique({ where: { id }, select: { userId: true } })
  if (!doc) throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  if (doc.userId && doc.userId !== userId) throw createError({ statusCode: 404, statusMessage: 'Document not found' })

  const { runId } = await reprocessDocument(id)
  return { documentId: id, runId, status: 'processing' }
})
