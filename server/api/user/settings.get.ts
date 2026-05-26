import {
  DEFAULT_ALLOWED_FORMATS,
  parseAllowedFormatsOrDefault,
} from '../../utils/allowed-formats'
import { requireSessionUserId } from '../../utils/session'
import {
  getEffectiveSettingForUpload,
  getRuntimeConfigFallback,
  getUserSettings,
  getWorkspaceSettingValue,
  resolveSystemSetting,
  SECRET_SETTING_KEYS,
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

export type UserSettingScalarField = {
  override: string
  system: string
  hasOverride: boolean
}

export type UserSettingSecretField = {
  configured: boolean
  systemConfigured: boolean
}

export type UserSettingFieldValue = UserSettingScalarField | UserSettingSecretField

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)

  const query = getQuery(event)
  const category = typeof query.category === 'string' ? query.category : 'general'

  if (!VALID_CATEGORIES.includes(category)) {
    throw createError({ statusCode: 400, statusMessage: `Invalid category. Valid: ${VALID_CATEGORIES.join(', ')}` })
  }

  const userValues = await getUserSettings(userId, category)
  const step = STEPS[category]

  const result: Record<string, UserSettingFieldValue | string> = {}

  if (step) {
    for (const field of step.configFields ?? []) {
      if (!field.envKey) continue

      const userVal = userValues[field.envKey]
      const system = await resolveSystemSetting(field.envKey, field.defaultValue)

      if (field.secret) {
        result[field.envKey] = {
          configured: Boolean(userVal),
          systemConfigured: Boolean(system),
        }
      } else {
        const hasOverride = userVal !== undefined && userVal !== ''
        result[field.envKey] = {
          override: userVal ?? '',
          system,
          hasOverride,
        }
      }
    }
  }

  // Legacy extra user keys not covered by wizard fields
  for (const [k, v] of Object.entries(userValues)) {
    if (k in result) continue
    if (SECRET_SETTING_KEYS.has(k)) {
      const system = await resolveSystemSetting(k, '')
      result[k] = { configured: Boolean(v), systemConfigured: Boolean(system) }
    } else {
      const system = await resolveSystemSetting(k, '')
      result[k] = { override: v, system, hasOverride: v !== '' }
    }
  }

  if (category === 'chunking') {
    const workspaceId = event.context.workspaceId
    if (workspaceId) {
      try {
        const config = useRuntimeConfig()
        const fallback =
          getRuntimeConfigFallback('ALLOWED_FORMATS') ||
          String(config.allowedFormats ?? DEFAULT_ALLOWED_FORMATS)
        const effective = await getEffectiveSettingForUpload(
          'ALLOWED_FORMATS',
          { workspaceId, userId },
          fallback,
        )
        result.effective_ALLOWED_FORMATS = parseAllowedFormatsOrDefault(effective).join(',')
        const wsOverride = await getWorkspaceSettingValue(workspaceId, 'ALLOWED_FORMATS')
        result.workspaceOverride_ALLOWED_FORMATS = wsOverride ? 'true' : 'false'
      } catch {
        // WorkspaceSetting table missing or DB unavailable — chunking fields still load
      }
    }
  }

  return result
})
