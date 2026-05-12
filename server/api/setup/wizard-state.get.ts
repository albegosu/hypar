import { prisma } from '~/server/utils/prisma'
import type { WizardConfig } from '~/utils/setup/wizard-types'
import { isPreInitialSetup } from '~/server/utils/setup-pre-user'

export default defineEventHandler(async () => {
  if (!(await isPreInitialSetup())) {
    return { config: {} as WizardConfig }
  }

  const row = await prisma.setting.findUnique({ where: { key: 'wizard.state' } })
  if (!row?.value) return { config: {} as WizardConfig }

  try {
    const parsed = JSON.parse(row.value) as unknown
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { config: parsed as WizardConfig }
    }
  } catch {
    /* ignore */
  }
  return { config: {} as WizardConfig }
})
