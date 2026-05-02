import { z } from 'zod'
import { inspect } from '../../utils/search.service'

const schema = z.object({
  query: z.string().min(1),
  limit: z.number().min(1).max(20).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.parse)
  return inspect(body.query, body.limit ?? 5)
})
