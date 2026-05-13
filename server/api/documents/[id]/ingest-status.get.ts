import { z } from 'zod'
import { WorkflowRunCancelledError, WorkflowRunFailedError } from 'workflow/errors'
import { getRun } from 'workflow/api'
import { prisma } from '../../../utils/prisma'
import type { IngestResult } from '../../../workflows/ingest-document'

const querySchema = z.object({
  runId: z.string().min(1).optional(),
})

function messageFromWorkflowTerminalError(err: unknown): string {
  if (WorkflowRunFailedError.is(err)) return err.message
  if (WorkflowRunCancelledError.is(err)) return err.message
  if (err instanceof Error) return err.message
  return String(err)
}

export default defineEventHandler(async (event) => {
  requireSessionUserId(event)
  const workspaceId = event.context.workspaceId
  if (!workspaceId) throw createError({ statusCode: 400, statusMessage: 'No active workspace' })
  const id = getRouterParam(event, 'id')!
  const { runId } = await getValidatedQuery(event, querySchema.parse)

  const doc = await prisma.document.findUnique({
    where: { id },
    select: { id: true, workspaceId: true, ingestStatus: true, ingestError: true, chunkCount: true },
  })
  if (!doc) throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  if (doc.workspaceId !== workspaceId) throw createError({ statusCode: 404, statusMessage: 'Document not found' })

  let runStatus: string | null = null

  // When the workflow run is terminal but Prisma was never updated (e.g. step
  // crashed after the engine marked the run failed), align the document row
  // and return a terminal status so clients stop polling.
  if (runId && doc.ingestStatus === 'processing') {
    try {
      const run = getRun<IngestResult>(runId)
      runStatus = await run.status

      if (runStatus === 'failed' || runStatus === 'cancelled') {
        let failureMessage =
          runStatus === 'cancelled' ? 'Workflow run was cancelled' : 'Workflow run failed'
        try {
          await run.returnValue
          failureMessage =
            'Workflow finished unexpectedly while the document was still marked processing'
        } catch (err) {
          failureMessage = messageFromWorkflowTerminalError(err)
        }
        await prisma.document
          .update({
            where: { id },
            data: {
              ingestStatus: 'failed',
              ingestError: failureMessage,
              chunkCount: 0,
            },
          })
          .catch(() => {})
        return {
          documentId: doc.id,
          status: 'failed' as const,
          chunkCount: 0,
          error: failureMessage,
          runStatus,
        }
      }

      if (runStatus === 'completed') {
        try {
          const result = await run.returnValue
          const ingestStatus = result.status === 'failed' ? 'failed' : 'ready'
          await prisma.document
            .update({
              where: { id },
              data: {
                ingestStatus,
                chunkCount: result.chunkCount ?? 0,
                ingestError: result.error ?? null,
              },
            })
            .catch(() => {})
          const fresh = await prisma.document.findUnique({
            where: { id },
            select: { id: true, ingestStatus: true, ingestError: true, chunkCount: true },
          })
          return {
            documentId: fresh?.id ?? doc.id,
            status: (fresh?.ingestStatus ?? ingestStatus) as typeof doc.ingestStatus,
            chunkCount: fresh?.chunkCount ?? result.chunkCount ?? 0,
            error: fresh?.ingestError ?? result.error ?? null,
            runStatus,
          }
        } catch (err) {
          const failureMessage = messageFromWorkflowTerminalError(err)
          await prisma.document
            .update({
              where: { id },
              data: {
                ingestStatus: 'failed',
                ingestError: failureMessage,
                chunkCount: 0,
              },
            })
            .catch(() => {})
          return {
            documentId: doc.id,
            status: 'failed' as const,
            chunkCount: 0,
            error: failureMessage,
            runStatus,
          }
        }
      }
    } catch {
      runStatus = null
    }
  }

  return {
    documentId: doc.id,
    status: doc.ingestStatus,
    chunkCount: doc.chunkCount,
    error: doc.ingestError,
    runStatus,
  }
})
