import { z } from 'zod'
import { ingestFromText } from '../../utils/documents.service'
import { enforceRateLimit } from '../../utils/rate-limit'

const schema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1),
  sourceType: z.enum(['text', 'markdown']),
  metadata: z.record(z.unknown()).optional(),
})

export default defineEventHandler(async (event) => {
  requireSessionUserId(event)
  await enforceRateLimit(event)
  const workspaceId = event.context.workspaceId
  if (!workspaceId) throw createError({ statusCode: 400, statusMessage: 'No active workspace' })
  const body = await readValidatedBody(event, schema.parse)
  return ingestFromText({ ...body, workspaceId })
})
