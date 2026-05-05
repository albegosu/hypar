import { requireAdmin } from '../../utils/admin-auth'
import { getSettings } from '../../utils/settings.service'

const VALID_CATEGORIES = ['embeddings', 'chunking', 'search', 'rag', 'general']

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const category = typeof query.category === 'string' ? query.category : 'general'

  if (!VALID_CATEGORIES.includes(category)) {
    throw createError({ statusCode: 400, statusMessage: `Invalid category. Valid: ${VALID_CATEGORIES.join(', ')}` })
  }

  return getSettings(category)
})
