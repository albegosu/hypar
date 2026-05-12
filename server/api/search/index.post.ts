import { z } from 'zod'
import { search } from '../../utils/search.service'

const schema = z.object({
  query: z.string().min(1),
  limit: z.number().min(1).max(20).optional(),
})

export default defineEventHandler(async (event) => {
  const userId = event.context.auth?.user?.id
  const body = await readValidatedBody(event, schema.parse)
  return search(body.query, { limit: body.limit ?? 5, userId })
})
