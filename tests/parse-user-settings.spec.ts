import { describe, it, expect } from 'vitest'
import { step1 } from '../utils/setup/wizard-steps'
import { parseUserSettingsResponse, userSettingValueForSave } from '../utils/parse-user-settings'
import { buildWizardDefaults, getStepFields } from '../utils/settings-form'

describe('parseUserSettingsResponse', () => {
  it('fills provider selects from system values when user has no override', () => {
    const data = {
      EMBEDDING_PROVIDER: { override: '', system: 'openai', hasOverride: false },
      LLM_PROVIDER: { override: '', system: 'anthropic', hasOverride: false },
    }
    const { formValues } = parseUserSettingsResponse(data, step1)
    expect(formValues.embeddingProvider).toBe('openai')
    expect(formValues.llmProvider).toBe('anthropic')
  })

  it('does not save unchanged system values as overrides', () => {
    const defaults = buildWizardDefaults(step1)
    const hints = { embeddingProvider: 'openai' }
    const field = getStepFields(step1).find((f) => f.id === 'embeddingProvider')!
    expect(userSettingValueForSave(field, 'openai', defaults, hints)).toBe('')
  })
})
