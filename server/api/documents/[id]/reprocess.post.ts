import { reprocessDocument } from '../../../utils/documents.service'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  requireSessionUserId(event)
  const workspaceId = event.context.workspaceId
  if (!workspaceId) throw createError({ statusCode: 400, statusMessage: 'No active workspace' })
  const id = getRouterParam(event, 'id')!

  const doc = await prisma.document.findUnique({ where: { id }, select: { workspaceId: true } })
  if (!doc) throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  if (doc.workspaceId !== workspaceId) throw createError({ statusCode: 404, statusMessage: 'Document not found' })

  const { runId } = await reprocessDocument(id)
  return { documentId: id, runId, status: 'processing' }
})
