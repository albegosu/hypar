import { z } from 'zod'
import { ingestFromText } from '../../utils/documents.service'

const schema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1),
  sourceType: z.enum(['text', 'markdown']),
  metadata: z.record(z.unknown()).optional(),
})

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const body = await readValidatedBody(event, schema.parse)
  return ingestFromText({ ...body, userId })
})
