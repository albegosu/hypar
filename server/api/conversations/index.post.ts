import { z } from 'zod'
import { ensureConversation } from '../../utils/conversations.service'

const schema = z.object({
  userId: z.string().max(200).optional(),
  title: z.string().max(200).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, schema.parse)
  const { id } = await ensureConversation(undefined, body.userId, body.title ?? '')
  return { id }
})
