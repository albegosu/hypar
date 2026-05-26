import type { ConfigField, WizardStep } from './setup/wizard-types'

export function getStepFields(step: WizardStep | null | undefined): ConfigField[] {
  return step?.configFields ?? []
}

export function parseFieldValue(raw: string, type: string): unknown {
  if (type === 'checkbox') return raw === 'true'
  if (type === 'number' || type === 'slider') return Number(raw)
  if (type === 'tags') return raw.split(',').map((s) => s.trim()).filter(Boolean)
  return raw
}

export function buildWizardDefaults(step: WizardStep): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  for (const field of getStepFields(step)) {
    defaults[field.id] = field.defaultValue
  }
  return defaults
}

export function valuesEqual(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => v === b[i])
  }
  return a === b
}
