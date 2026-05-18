import { z } from 'zod'
import { requireAdmin } from '../../utils/admin-auth'
import { upsertSetting } from '../../utils/settings.service'

const SETTING_CATEGORIES = [
  'apis',
  'vectorDb',
  'embeddings',
  'chunking',
  'search',
  'rag',
  'general',
] as const

const bodySchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(2000),
  category: z.enum(SETTING_CATEGORIES).default('general'),
})

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message })
  }

  const { key, value, category } = parsed.data

  // If the client echoes back a masked value, the secret was not changed — skip write
  if (value.startsWith('••••')) {
    return { ok: true, key, skipped: true }
  }

  await upsertSetting(key, value, category)

  return { ok: true, key, value, category }
})
