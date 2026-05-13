import { z } from 'zod'
import { ensureConversation } from '../../utils/conversations.service'

const schema = z.object({
  title: z.string().max(200).optional(),
})

export default defineEventHandler(async (event) => {
  requireSessionUserId(event)
  const workspaceId = event.context.workspaceId
  if (!workspaceId) throw createError({ statusCode: 400, statusMessage: 'No active workspace' })
  const body = await readValidatedBody(event, schema.parse)
  const { id } = await ensureConversation(undefined, workspaceId, body.title ?? '')
  return { id }
})
