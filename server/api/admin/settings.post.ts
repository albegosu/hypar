import { z } from 'zod'
import { requireAuthOrAdminApiKey } from '../../utils/admin-auth'
import { upsertSetting } from '../../utils/settings.service'

const VALID_CATEGORIES = ['apis', 'vectorDb', 'embeddings', 'chunking', 'search', 'rag', 'general']

const bodySchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(2000),
  category: z.enum(['apis', 'vectorDb', 'embeddings', 'chunking', 'search', 'rag', 'general']).default('general'),
})

export default defineEventHandler(async (event) => {
  requireAuthOrAdminApiKey(event)

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message })
  }

  const { key, value, category } = parsed.data
  await upsertSetting(key, value, category)

  return { ok: true, key, value, category }
})
