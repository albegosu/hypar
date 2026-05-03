import { z } from 'zod'
import { deleteConversation } from '../../utils/conversations.service'

const querySchema = z.object({ userId: z.string().optional() })

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const { userId } = await getValidatedQuery(event, querySchema.parse)
  await deleteConversation(id, userId)
  setResponseStatus(event, 204)
})
