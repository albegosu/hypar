import { z } from 'zod'
import { listConversations } from '../../utils/conversations.service'

const querySchema = z.object({ userId: z.string().optional() })

export default defineEventHandler(async (event) => {
  const { userId } = await getValidatedQuery(event, querySchema.parse)
  return { items: await listConversations(userId) }
})
