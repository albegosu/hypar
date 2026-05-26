import { step1, step2, step3, step4, step5, step6 } from '~/utils/setup/wizard-steps'
import type { WizardStep } from '~/utils/setup/wizard-types'
import { buildWizardDefaults, getStepFields, parseFieldValue, valuesEqual } from '~/utils/settings-form'

export const SETTINGS_TABS = [
  { id: 'apis', step: step1 },
  { id: 'vectorDb', step: step2 },
  { id: 'embeddings', step: step3 },
  { id: 'chunking', step: step4 },
  { id: 'search', step: step5 },
  { id: 'rag', step: step6 },
] as const

export type SettingsTabId = (typeof SETTINGS_TABS)[number]['id']

export interface SettingsTabLoadResult {
  formValues: Record<string, unknown>
  /** Per-tab metadata (e.g. secret flags, system hints) keyed by field id or envKey */
  extras?: Record<string, unknown>
}

export function useSettingsTabs(options: {
  fetchUrl: (tabId: string) => string
  parseResponse: (data: unknown, step: WizardStep) => SettingsTabLoadResult
}) {
  const activeTab = ref<SettingsTabId>('apis')
  const loadingTab = ref(true)
  const loadError = ref<string | null>(null)
  const formValues = ref<Record<string, unknown>>({})
  const loadedValues = ref<Record<string, Record<string, unknown>>>({})
  const loadedExtras = ref<Record<string, Record<string, unknown>>>({})

  let loadSeq = 0

  const currentStep = computed(
    () => SETTINGS_TABS.find((t) => t.id === activeTab.value)?.step ?? null,
  )
  const currentFields = computed(() => getStepFields(currentStep.value))
  const currentExtras = computed(() => loadedExtras.value[activeTab.value] ?? {})

  async function loadTab(tabId: SettingsTabId, opts?: { invalidate?: boolean }) {
    const step = SETTINGS_TABS.find((t) => t.id === tabId)?.step
    if (!step) {
      if (activeTab.value === tabId) loadingTab.value = false
      return
    }

    if (opts?.invalidate) {
      delete loadedValues.value[tabId]
      delete loadedExtras.value[tabId]
    }

    const seq = ++loadSeq
    if (activeTab.value === tabId) {
      loadingTab.value = true
      loadError.value = null
    }

    try {
      const data = await $fetch(options.fetchUrl(tabId))
      if (seq !== loadSeq) return

      const result = options.parseResponse(data, step)
      loadedValues.value[tabId] = result.formValues
      if (result.extras) loadedExtras.value[tabId] = result.extras
      if (activeTab.value === tabId) {
        formValues.value = { ...result.formValues }
        loadError.value = null
      }
    } catch (err) {
      if (seq !== loadSeq) return
      const defaults = buildWizardDefaults(step)
      loadedValues.value[tabId] = defaults
      delete loadedExtras.value[tabId]
      if (activeTab.value === tabId) {
        formValues.value = { ...defaults }
        loadError.value = extractFetchError(err)
      }
    } finally {
      if (seq === loadSeq && activeTab.value === tabId) {
        loadingTab.value = false
      }
    }
  }

  function extractFetchError(err: unknown): string {
    if (err && typeof err === 'object') {
      const e = err as { data?: { statusMessage?: string }; statusMessage?: string; message?: string }
      return e.data?.statusMessage ?? e.statusMessage ?? e.message ?? 'Request failed'
    }
    return 'Request failed'
  }

  async function switchTab(id: SettingsTabId) {
    if (loadedValues.value[id]) {
      formValues.value = { ...loadedValues.value[id] }
      activeTab.value = id
      loadingTab.value = false
      return
    }
    activeTab.value = id
    await loadTab(id)
  }

  async function invalidateAndReload() {
    await loadTab(activeTab.value, { invalidate: true })
  }

  onMounted(() => loadTab(activeTab.value))

  return {
    activeTab,
    loadingTab,
    loadError,
    formValues,
    loadedValues,
    loadedExtras,
    currentStep,
    currentFields,
    currentExtras,
    switchTab,
    loadTab,
    invalidateAndReload,
  }
}
