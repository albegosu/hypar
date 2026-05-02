import { z } from 'zod'
import { createFromText } from '../../utils/documents.service'

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  sourceType: z.enum(['text', 'markdown']),
  userId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.parse)
  return createFromText(body)
})
