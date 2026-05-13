<template>
  <div class="max-w-3xl mx-auto px-4 py-6 pb-28">
    <!-- Rate limit notice -->
    <div
      v-if="showRateLimitBanner"
      class="mb-5 wz-panel p-4 text-xs space-y-1"
      style="border-color: var(--term-accent);"
    >
      <p class="wz-accent font-mono">⚡ {{ t('settings.rateLimitBanner') }}</p>
      <p class="wz-muted">{{ t('settings.rateLimitBannerHint') }}</p>
    </div>

    <div class="mb-6">
      <h1 class="text-lg font-semibold wz-strong">{{ t('settings.userTitle') }}</h1>
      <p class="text-xs wz-faint mt-1">{{ t('settings.userSubtitle') }}</p>
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

      <!-- Config form -->
      <div v-if="currentStep" class="space-y-4">
        <!-- Secret-field status badges (shown above the form for the apis tab) -->
        <div v-if="secretStatuses.length" class="flex flex-wrap gap-2 text-[10px] font-mono">
          <span
            v-for="s in secretStatuses"
            :key="s.key"
            class="px-2 py-0.5 rounded"
            :class="s.configured
              ? 'wz-pill wz-accent'
              : 'wz-pill wz-faint'"
          >
            {{ s.key }}: {{ s.configured ? t('settings.ownKey') : t('settings.systemDefault') }}
          </span>
        </div>

        <SetupWizardConfigForm
          :step-id="currentStep.id"
          :fields="currentFields"
          :model-value="formValues"
          :show-field-errors="false"
          @update:model-value="formValues = $event"
        />
        <div class="flex justify-end gap-2 mt-2">
          <button class="wz-btn-ghost text-xs" :disabled="saving" @click="resetTab">
            {{ t('settings.userReset') }}
          </button>
          <button class="wz-btn-primary text-xs" :disabled="saving" @click="saveTab">
            {{ saving ? t('settings.saving') : t('settings.save') }}
          </button>
        </div>
      </div>

      <div v-else class="text-xs wz-faint py-4 text-center">{{ t('common.loading') }}</div>

      <!-- Privacy note -->
      <div class="wz-panel p-4 text-xs space-y-1 wz-faint">
        <p class="font-mono wz-label">// {{ t('settings.privacyTitle') }}</p>
        <p>{{ t('settings.privacyBody') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { step1, step2, step3, step4, step5, step6 } from '~/utils/setup/wizard-steps'
import type { ConfigField, WizardStep } from '~/utils/setup/wizard-types'

const { t } = useI18n()
const route = useRoute()

const showRateLimitBanner = computed(() => route.query.reason === 'ratelimit')

const activeTab = ref('apis')
const saving = ref(false)
const saveStatus = ref<{ ok: boolean; message: string } | null>(null)
const formValues = ref<Record<string, unknown>>({})
const loadedValues = ref<Record<string, Record<string, unknown>>>({})
// Tracks which secret fields already have a user-configured key (per tab)
const secretConfigured = ref<Record<string, Record<string, boolean>>>({})

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

/** Secret fields in the active tab with their configured status */
const secretStatuses = computed(() => {
  const configured = secretConfigured.value[activeTab.value] ?? {}
  return currentFields.value
    .filter((f) => f.secret && f.envKey)
    .map((f) => ({ key: f.envKey!, configured: configured[f.envKey!] ?? false }))
})

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
    const data = await $fetch<Record<string, string | { configured: boolean }>>(
      `/api/user/settings?category=${tabId}`
    )

    const defaults: Record<string, unknown> = {}
    const overlay: Record<string, unknown> = {}
    const secretMap: Record<string, boolean> = {}

    for (const field of getStepFields(step)) {
      defaults[field.id] = field.defaultValue
      if (!field.envKey) continue

      const raw = data[field.envKey]
      if (field.secret) {
        // Server returns { configured: boolean } for secrets — never the value
        const configured = typeof raw === 'object' && raw !== null && 'configured' in raw
          ? (raw as { configured: boolean }).configured
          : false
        secretMap[field.envKey] = configured
        // Use sentinel '••••' so the field shows as non-empty when configured
        overlay[field.id] = configured ? '••••' : ''
      } else if (raw !== undefined && typeof raw === 'string') {
        overlay[field.id] = parseFieldValue(raw, field.type)
      }
    }

    secretConfigured.value[tabId] = secretMap
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
        .map((field) => {
          const val = formValues.value[field.id]
          const value = Array.isArray(val) ? (val as string[]).join(',') : String(val ?? '')
          // Skip secret fields that still hold the sentinel (user didn't touch them)
          if (value === '••••') return Promise.resolve()
          return $fetch('/api/user/settings', {
            method: 'PUT',
            body: { key: field.envKey, value, category: activeTab.value },
          })
        }),
    )
    // Reload to reflect new secret statuses
    delete loadedValues.value[activeTab.value]
    await loadTab(activeTab.value)
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
          $fetch('/api/user/settings', {
            method: 'PUT',
            body: { key: field.envKey, value: '', category: activeTab.value },
          }),
        ),
    )
    delete loadedValues.value[activeTab.value]
    await loadTab(activeTab.value)
    saveStatus.value = {
      ok: true,
      message: t('settings.userResetOk', { section: t(`settings.tabs.${activeTab.value}`) }),
    }
  } catch {
    saveStatus.value = { ok: false, message: t('settings.userResetFail') }
  } finally {
    saving.value = false
  }
}
</script>
