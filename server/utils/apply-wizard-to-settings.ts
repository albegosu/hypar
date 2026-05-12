import type { WizardConfig } from '~/utils/setup/wizard-types'
import { wizardSteps, buildDatabaseUrl } from '~/utils/setup/wizard-steps'
import { upsertSetting } from './settings.service'

/**
 * Flattens wizard answers into `Setting` rows (same keys as `.env` / admin panel).
 * DATABASE_URL is derived from the vector DB step when that step has any values.
 */
export async function applyWizardConfigToSettings(config: WizardConfig): Promise<string[]> {
  const applied: string[] = []

  for (const step of wizardSteps) {
    const data = config[step.id]
    if (!data || typeof data !== 'object') continue

    for (const field of step.configFields ?? []) {
      if (!field.envKey) continue
      const raw = data[field.id]
      if (raw === undefined || raw === null) continue
      if (typeof raw === 'string' && raw.trim() === '') continue
      const val = typeof raw === 'boolean' ? (raw ? 'true' : 'false') : String(raw)
      await upsertSetting(field.envKey, val, step.id)
      applied.push(field.envKey)
    }
  }

  const vd = config.vectorDb
  if (vd && typeof vd === 'object' && Object.keys(vd).length > 0) {
    const url = buildDatabaseUrl(config)
    await upsertSetting('DATABASE_URL', url, 'vectorDb')
    applied.push('DATABASE_URL')
  }

  return applied
}
