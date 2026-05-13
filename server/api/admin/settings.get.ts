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

  const dbValues = await getSettings(category)
  const step = STEPS[category]
  if (!step) return dbValues

  const result: Record<string, string> = {}

  for (const field of step.configFields ?? []) {
    if (!field.envKey) continue

    // Resolve: DB first, then env
    const dbVal = dbValues[field.envKey] as string | undefined
    const envVal = process.env[field.envKey]
    const resolved = dbVal ?? (envVal !== undefined && envVal !== '' ? envVal : '')

    // Never send secret values to the client — return a mask instead
    result[field.envKey] = field.secret ? maskSecret(resolved) : resolved
  }

  // Include any non-field DB values (non-secret config like booleans, numbers)
  for (const [k, v] of Object.entries(dbValues)) {
    if (!(k in result)) result[k] = v as string
  }

  return result
})
