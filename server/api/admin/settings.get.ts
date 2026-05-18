import { requireAdmin } from '../../utils/admin-auth'
import {
  getSetting,
  getRuntimeConfigFallback,
  stringifyWizardDefault,
} from '../../utils/settings.service'
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

function maskSecret(value: string): string {
  if (!value) return ''
  return '••••' + value.slice(-4)
}

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const category = typeof query.category === 'string' ? query.category : 'general'

  if (!VALID_CATEGORIES.includes(category)) {
    throw createError({ statusCode: 400, statusMessage: `Invalid category. Valid: ${VALID_CATEGORIES.join(', ')}` })
  }

  const step = STEPS[category]
  if (!step) return {}

  const result: Record<string, string> = {}

  for (const field of step.configFields ?? []) {
    if (!field.envKey) continue

    // Same resolution as runtime: DB → process.env → runtimeConfig default
    const fallback =
      getRuntimeConfigFallback(field.envKey) || stringifyWizardDefault(field.defaultValue)
    const resolved = await getSetting(field.envKey, fallback)

    // Never send secret values to the client — return a mask instead
    result[field.envKey] = field.secret ? maskSecret(resolved) : resolved
  }

  return result
})
