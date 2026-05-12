import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { upsertSetting } from '~/server/utils/settings.service'
import { requirePreInitialSetup } from '~/server/utils/setup-pre-user'
import type { WizardConfig } from '~/utils/setup/wizard-types'

const bodySchema = z.object({
  patch: z.record(z.string(), z.record(z.string(), z.unknown())).optional().default({}),
})

function mergeWizard(base: WizardConfig, patch: Partial<WizardConfig>): WizardConfig {
  const keys = new Set([...Object.keys(base), ...Object.keys(patch)])
  const out: WizardConfig = {}
  for (const k of keys) {
    const a = base[k]
    const b = patch[k]
    if (b === undefined) {
      if (a !== undefined) out[k] = { ...a }
    } else if (typeof b === 'object' && b !== null && !Array.isArray(b)) {
      out[k] = { ...(typeof a === 'object' && a !== null && !Array.isArray(a) ? a : {}), ...b }
    }
  }
  return out
}

export default defineEventHandler(async (event) => {
  await requirePreInitialSetup()

  const { patch } = await readValidatedBody(event, bodySchema.parse)

  const row = await prisma.setting.findUnique({ where: { key: 'wizard.state' } })
  let existing: WizardConfig = {}
  if (row?.value) {
    try {
      const parsed = JSON.parse(row.value) as unknown
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        existing = parsed as WizardConfig
      }
    } catch {
      existing = {}
    }
  }

  const merged = mergeWizard(existing, patch)
  await upsertSetting('wizard.state', JSON.stringify(merged), 'system')

  return { ok: true }
})
