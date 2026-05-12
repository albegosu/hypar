import { z } from 'zod'
import { ensureConversation } from '../../utils/conversations.service'

const schema = z.object({
  title: z.string().max(200).optional(),
})

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const body = await readValidatedBody(event, schema.parse)
  const { id } = await ensureConversation(undefined, userId, body.title ?? '')
  return { id }
})
