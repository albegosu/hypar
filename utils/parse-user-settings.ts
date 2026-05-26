import type { UserSettingFieldValue } from '~/server/api/user/settings.get'
import type { ConfigField, WizardStep } from './setup/wizard-types'
import { buildWizardDefaults, getStepFields, parseFieldValue } from './settings-form'

export interface ParsedUserSettings {
  formValues: Record<string, unknown>
  extras: {
    systemHints: Record<string, unknown>
    secretConfigured: Record<string, boolean>
    effectiveAllowedFormats?: string
    workspaceOverrideAllowedFormats?: boolean
  }
}

/** Maps GET /api/user/settings response into form state (effective values, not empty placeholders). */
export function parseUserSettingsResponse(data: unknown, step: WizardStep): ParsedUserSettings {
  const apiData = data as Record<string, UserSettingFieldValue | string>
  const defaults = buildWizardDefaults(step)
  const formValues: Record<string, unknown> = { ...defaults }
  const systemHints: Record<string, unknown> = {}
  const secretConfigured: Record<string, boolean> = {}

  for (const field of getStepFields(step)) {
    if (!field.envKey) continue

    const raw = apiData[field.envKey]
    if (!raw || typeof raw === 'string') continue

    if (field.secret && 'configured' in raw) {
      secretConfigured[field.envKey] = raw.configured
      formValues[field.id] = raw.configured ? '••••' : ''
      continue
    }

    if ('system' in raw) {
      const scalar = raw
      if (scalar.system) {
        systemHints[field.id] = parseFieldValue(scalar.system, field.type)
      }

      if (scalar.hasOverride && scalar.override !== '') {
        formValues[field.id] = parseFieldValue(scalar.override, field.type)
      } else if (scalar.system) {
        formValues[field.id] = parseFieldValue(scalar.system, field.type)
      }
    }
  }

  const api = data as Record<string, unknown>
  const effectiveAllowedFormats =
    typeof api.effective_ALLOWED_FORMATS === 'string' ? api.effective_ALLOWED_FORMATS : undefined
  const workspaceOverrideAllowedFormats = api.workspaceOverride_ALLOWED_FORMATS === 'true'

  return {
    formValues,
    extras: {
      systemHints,
      secretConfigured,
      effectiveAllowedFormats,
      workspaceOverrideAllowedFormats,
    },
  }
}

export function userSettingValueForSave(
  field: ConfigField,
  formVal: unknown,
  defaults: Record<string, unknown>,
  systemHints: Record<string, unknown>,
): string | null {
  if (!field.envKey) return null
  if (field.secret) {
    if (formVal === '••••') return null
    return String(formVal ?? '')
  }

  const baseline = systemHints[field.id] ?? defaults[field.id]
  const current = formVal

  if (Array.isArray(baseline) && Array.isArray(current)) {
    const a = baseline.join(',')
    const b = current.join(',')
    return a === b ? '' : b
  }

  if (current === undefined || current === null || current === '') {
    return ''
  }

  const str = String(current)
  if (baseline !== undefined && String(baseline) === str) return ''
  return str
}
