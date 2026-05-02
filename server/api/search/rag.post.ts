import { z } from 'zod'
import { rag } from '../../utils/search.service'

const schema = z.object({
  query: z.string().min(1),
  limit: z.number().min(1).max(20).optional(),
  userId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.parse)
  return rag(body.query, body.limit ?? 5, body.userId)
})
