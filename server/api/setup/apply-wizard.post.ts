import { z } from 'zod'
import { applyWizardConfigToSettings } from '~/server/utils/apply-wizard-to-settings'
import { upsertSetting, invalidateCache } from '~/server/utils/settings.service'
import { requirePreInitialSetup } from '~/server/utils/setup-pre-user'
import { invalidateEmbeddingCache } from '~/server/utils/embedding'
import type { WizardConfig } from '~/utils/setup/wizard-types'

const bodySchema = z.object({
  config: z.record(z.string(), z.record(z.string(), z.unknown())),
})

export default defineEventHandler(async (event) => {
  await requirePreInitialSetup()

  const { config } = await readValidatedBody(event, bodySchema.parse)
  const wizardConfig = config as WizardConfig

  const keys = await applyWizardConfigToSettings(wizardConfig)
  await upsertSetting('wizard.state', JSON.stringify(wizardConfig), 'system')
  invalidateCache()
  await invalidateEmbeddingCache()

  return { ok: true, keysApplied: keys.length, keys }
})
