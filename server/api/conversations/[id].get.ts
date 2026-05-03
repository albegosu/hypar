import { z } from 'zod'
import { getConversation } from '../../utils/conversations.service'

const querySchema = z.object({ userId: z.string().optional() })

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const { userId } = await getValidatedQuery(event, querySchema.parse)
  return getConversation(id, userId)
})
