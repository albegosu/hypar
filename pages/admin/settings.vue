<template>
  <div class="max-w-3xl mx-auto px-4 py-6 pb-28">
    <div class="mb-6">
      <h1 class="text-lg font-semibold wz-strong">{{ t('settings.title') }}</h1>
      <p class="text-xs wz-faint mt-1">{{ t('settings.subtitle') }}</p>
    </div>

    <div class="space-y-4">
      <!-- Tab nav -->
      <div class="flex gap-1 text-xs flex-wrap">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-3 py-1.5 rounded transition-colors duration-150"
          :class="activeTab === tab.id ? 'wz-btn-outline font-semibold' : 'wz-btn-ghost'"
          @click="switchTab(tab.id)"
        >
          {{ t(`settings.tabs.${tab.id}`) }}
        </button>
      </div>

      <!-- Status banner -->
      <div
        v-if="saveStatus"
        role="status"
        class="wz-flash"
        :class="saveStatus.ok ? 'wz-flash--ok' : 'wz-flash--err'"
      >
        <span class="wz-flash__icon" aria-hidden="true">
          <UIcon
            :name="saveStatus.ok ? 'i-heroicons-check' : 'i-heroicons-x-mark'"
            class="size-2"
          />
        </span>
        <p class="min-w-0 pt-0.5 m-0 font-medium tracking-tight">
          {{ saveStatus.message }}
        </p>
      </div>

      <!-- Config form for active tab -->
      <div v-if="currentStep" class="space-y-4">
        <SetupWizardConfigForm
          :step-id="currentStep.id"
          :fields="currentFields"
          :model-value="formValues"
          @update:model-value="formValues = $event"
        />
        <div class="flex justify-end gap-2 mt-2">
          <button class="wz-btn-ghost text-xs" :disabled="saving" @click="resetTab">
            {{ t('settings.reset') }}
          </button>
          <button class="wz-btn-primary text-xs" :disabled="saving" @click="saveTab">
            {{ saving ? t('settings.saving') : t('settings.save') }}
          </button>
        </div>
      </div>

      <div v-else class="text-xs wz-faint py-4 text-center">{{ t('common.loading') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { step1, step2, step3, step4, step5, step6 } from '~/utils/setup/wizard-steps'
import type { ConfigField, WizardStep } from '~/utils/setup/wizard-types'

definePageMeta({ middleware: ['admin'] })

const { t } = useI18n()

const activeTab = ref('apis')
const saving = ref(false)
const saveStatus = ref<{ ok: boolean; message: string } | null>(null)
const formValues = ref<Record<string, unknown>>({})
const loadedValues = ref<Record<string, Record<string, unknown>>>({})

const tabs = [
  { id: 'apis', step: step1 },
  { id: 'vectorDb', step: step2 },
  { id: 'embeddings', step: step3 },
  { id: 'chunking', step: step4 },
  { id: 'search', step: step5 },
  { id: 'rag', step: step6 },
]

const currentStep = computed(() => tabs.find((t) => t.id === activeTab.value)?.step ?? null)
const currentFields = computed(() => getStepFields(currentStep.value))

function getStepFields(step: WizardStep | null | undefined): ConfigField[] {
  return step?.configFields ?? []
}

onMounted(() => loadTab(activeTab.value))

async function switchTab(id: string) {
  activeTab.value = id
  saveStatus.value = null
  if (!loadedValues.value[id]) {
    await loadTab(id)
  } else {
    formValues.value = { ...loadedValues.value[id] }
  }
}

async function loadTab(tabId: string) {
  const step = tabs.find((t) => t.id === tabId)?.step
  if (!step) return

  try {
    const data = await $fetch<Record<string, string>>(`/api/admin/settings?category=${tabId}`)
    const defaults: Record<string, unknown> = {}
    const overlay: Record<string, unknown> = {}
    for (const field of getStepFields(step)) {
      defaults[field.id] = field.defaultValue
      if (field.envKey && data[field.envKey] !== undefined) {
        overlay[field.id] = parseFieldValue(data[field.envKey], field.type)
      }
    }
    const merged = { ...defaults, ...overlay }
    loadedValues.value[tabId] = merged
    formValues.value = { ...merged }
  } catch {
    const defaults: Record<string, unknown> = {}
    for (const field of getStepFields(step)) defaults[field.id] = field.defaultValue
    loadedValues.value[tabId] = defaults
    formValues.value = { ...defaults }
  }
}

function parseFieldValue(raw: string, type: string): unknown {
  if (type === 'checkbox') return raw === 'true'
  if (type === 'number' || type === 'slider') return Number(raw)
  if (type === 'tags') return raw.split(',').map((s) => s.trim()).filter(Boolean)
  return raw
}

async function saveTab() {
  const step = currentStep.value
  if (!step) return
  saving.value = true
  saveStatus.value = null
  try {
    await Promise.all(
      getStepFields(step)
        .filter((field) => field.envKey)
        .filter((field) => {
          if (!field.dependsOn) return true
          return formValues.value[field.dependsOn.field] === field.dependsOn.equals
        })
        .map((field) => {
          const val = formValues.value[field.id]
          const value = Array.isArray(val) ? (val as string[]).join(',') : String(val ?? '')
          return $fetch('/api/admin/settings', {
            method: 'POST',
            body: { key: field.envKey, value, category: activeTab.value },
          })
        }),
    )
    loadedValues.value[activeTab.value] = { ...formValues.value }
    saveStatus.value = {
      ok: true,
      message: t('settings.savedOk', { section: t(`settings.tabs.${activeTab.value}`) }),
    }
  } catch {
    saveStatus.value = { ok: false, message: t('settings.savedFail') }
  } finally {
    saving.value = false
  }
}

async function resetTab() {
  const step = currentStep.value
  if (!step) return
  saving.value = true
  saveStatus.value = null
  try {
    await Promise.all(
      getStepFields(step)
        .filter((field) => field.envKey)
        .map((field) =>
          $fetch('/api/admin/settings', {
            method: 'POST',
            body: { key: field.envKey, value: '', category: activeTab.value },
          }),
        ),
    )
    delete loadedValues.value[activeTab.value]
    await loadTab(activeTab.value)
    saveStatus.value = { ok: true, message: t('settings.resetOk') }
  } catch {
    saveStatus.value = { ok: false, message: t('settings.resetFail') }
  } finally {
    saving.value = false
  }
}
</script>
