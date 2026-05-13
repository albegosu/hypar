import { z } from 'zod'
import { requireSessionUserId } from '../../utils/session'
import { upsertUserSetting, deleteUserSetting } from '../../utils/settings.service'
import { invalidateRateLimitCache } from '../../utils/rate-limit'

const bodySchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(2000),
  category: z.enum(['apis', 'vectorDb', 'embeddings', 'chunking', 'search', 'rag', 'general']).default('general'),
})

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message })
  }

  const { key, value, category } = parsed.data

  if (value === '') {
    await deleteUserSetting(userId, key)
    invalidateRateLimitCache(userId)
    return { ok: true, key, deleted: true }
  }

  await upsertUserSetting(userId, key, value, category)
  invalidateRateLimitCache(userId)
  return { ok: true, key, category }
})
