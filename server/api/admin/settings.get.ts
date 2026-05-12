import { requireAdmin } from '../../utils/admin-auth'
import { getSettings } from '../../utils/settings.service'
import { step1, step2, step3, step4, step5, step6 } from '~/utils/setup/wizard-steps'
import type { WizardStep } from '~/utils/setup/wizard-types'

const VALID_CATEGORIES = ['apis', 'vectorDb', 'embeddings', 'chunking', 'search', 'rag', 'general']

const STEPS: Record<string, WizardStep> = {
  apis: step1,
  vectorDb: step2,
  embeddings: step3,
  chunking: step4,
  search: step5,
  rag: step6,
}

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const category = typeof query.category === 'string' ? query.category : 'general'

  if (!VALID_CATEGORIES.includes(category)) {
    throw createError({ statusCode: 400, statusMessage: `Invalid category. Valid: ${VALID_CATEGORIES.join(', ')}` })
  }

  const dbValues = await getSettings(category)
  const step = STEPS[category]
  if (!step) return dbValues

  // Enrich with env var fallbacks for keys not saved in DB (BD > .env > default)
  const envFallbacks: Record<string, string> = {}
  for (const field of step.configFields ?? []) {
    if (!field.envKey) continue
    const envVal = process.env[field.envKey]
    if (envVal !== undefined && envVal !== '') {
      envFallbacks[field.envKey] = envVal
    }
  }

  return { ...envFallbacks, ...dbValues }
})
