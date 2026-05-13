import { z } from 'zod'
import { search } from '../../utils/search.service'
import { enforceRateLimit } from '../../utils/rate-limit'

const schema = z.object({
  query: z.string().min(1),
  limit: z.number().min(1).max(20).optional(),
})

export default defineEventHandler(async (event) => {
  requireSessionUserId(event)
  await enforceRateLimit(event)
  const workspaceId = event.context.workspaceId
  const body = await readValidatedBody(event, schema.parse)
  return search(body.query, { limit: body.limit ?? 5, workspaceId })
})
