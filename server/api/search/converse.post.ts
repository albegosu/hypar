import { z } from 'zod'
import { converse } from '../../utils/search.service'

const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
})

const schema = z.object({
  messages: z.array(messageSchema).min(1),
  userId: z.string().optional(),
  limit: z.number().min(1).max(20).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.parse)
  return converse(body)
})
