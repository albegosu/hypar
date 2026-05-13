import { requireSessionUserId } from '../../utils/session'
import { getUserSettings, SECRET_SETTING_KEYS } from '../../utils/settings.service'
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
  const userId = requireSessionUserId(event)

  const query = getQuery(event)
  const category = typeof query.category === 'string' ? query.category : 'general'

  if (!VALID_CATEGORIES.includes(category)) {
    throw createError({ statusCode: 400, statusMessage: `Invalid category. Valid: ${VALID_CATEGORIES.join(', ')}` })
  }

  const userValues = await getUserSettings(userId, category)
  const step = STEPS[category]

  // Return user's own values; secret fields are masked in response (never send decrypted)
  const result: Record<string, string | { configured: boolean }> = {}

  if (step) {
    for (const field of step.configFields ?? []) {
      if (!field.envKey) continue
      const val = userValues[field.envKey]
      if (field.secret) {
        result[field.envKey] = { configured: Boolean(val) }
      } else {
        result[field.envKey] = val ?? ''
      }
    }
  }

  // Include any extra user keys not covered by wizard fields
  for (const [k, v] of Object.entries(userValues)) {
    if (!(k in result)) {
      result[k] = SECRET_SETTING_KEYS.has(k) ? { configured: Boolean(v) } : v
    }
  }

  return result
})
