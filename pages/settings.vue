<template>
  <div class="max-w-3xl mx-auto px-4 py-6 pb-28">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-lg font-semibold wz-strong">{{ t('settings.title') }}</h1>
      <p class="text-xs wz-faint mt-1">{{ t('settings.subtitle') }}</p>
    </div>

    <!-- Auth gate -->
    <div v-if="!authed" class="wz-panel p-5 space-y-4">
      <p class="text-xs wz-label">{{ t('settings.authTitle') }}</p>
      <div class="flex gap-2">
        <input
          v-model="tokenInput"
          type="password"
          :placeholder="t('settings.tokenPlaceholder')"
          class="wz-input flex-1 font-mono text-xs"
          @keyup.enter="authenticate"
        />
        <button class="wz-btn-primary text-xs" @click="authenticate">
          {{ t('settings.unlock') }}
        </button>
      </div>
      <p v-if="authError" class="text-xs text-red-400">{{ authError }}</p>
    </div>

    <!-- Settings tabs -->
    <div v-else class="space-y-4">
      <!-- Tab nav -->
      <div class="flex gap-1 text-xs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-3 py-1.5 rounded transition-colors duration-150"
          :class="activeTab === tab.id
            ? 'wz-btn-outline font-semibold'
            : 'wz-btn-ghost'"
          @click="switchTab(tab.id)"
        >
          {{ t(`settings.tabs.${tab.id}`) }}
        </button>
        <button class="ml-auto wz-btn-ghost text-xs" @click="logout">
          {{ t('settings.lock') }}
        </button>
      </div>

      <!-- Status banner -->
      <div v-if="saveStatus" class="text-xs px-3 py-2 rounded" :class="saveStatus.ok ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'">
        {{ saveStatus.message }}
      </div>

      <!-- Config form for active tab -->
      <div v-if="currentStep" class="space-y-4">
        <LearnWizardConfigForm
          :step-id="currentStep.id"
          :fields="currentStep.configFields"
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

      <!-- Loading state -->
      <div v-else class="text-xs wz-faint py-4 text-center">{{ t('common.loading') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { step3, step4, step5, step6 } from '~/utils/learning/wizard/wizard-steps'

const { t } = useI18n()

const STORAGE_KEY = 'fragua_admin_token'

const tokenInput = ref('')
const authError = ref('')
const authed = ref(false)
const adminToken = ref('')

const activeTab = ref('embeddings')
const saving = ref(false)
const saveStatus = ref<{ ok: boolean; message: string } | null>(null)

// formValues holds current field values for the active tab
const formValues = ref<Record<string, unknown>>({})

// Track loaded values per tab so we know what the DB/env currently has
const loadedValues = ref<Record<string, Record<string, unknown>>>({})

const tabs = [
  { id: 'embeddings', step: step3 },
  { id: 'chunking', step: step4 },
  { id: 'search', step: step5 },
  { id: 'rag', step: step6 },
]

const currentStep = computed(() => tabs.find((t) => t.id === activeTab.value)?.step ?? null)

// ─── auth ──────────────────────────────────────────────────────────────────

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    adminToken.value = stored
    authed.value = true
    loadTab(activeTab.value)
  }
})

async function authenticate() {
  authError.value = ''
  if (!tokenInput.value.trim()) {
    authError.value = t('settings.errorEmpty')
    return
  }
  const ok = await testToken(tokenInput.value.trim())
  if (ok) {
    adminToken.value = tokenInput.value.trim()
    localStorage.setItem(STORAGE_KEY, adminToken.value)
    authed.value = true
    tokenInput.value = ''
    loadTab(activeTab.value)
  } else {
    authError.value = t('settings.errorInvalid')
  }
}

async function testToken(token: string): Promise<boolean> {
  try {
    const res = await $fetch('/api/admin/settings?category=embeddings', {
      headers: { 'x-admin-key': token },
    })
    return res !== null
  } catch {
    return false
  }
}

function logout() {
  localStorage.removeItem(STORAGE_KEY)
  authed.value = false
  adminToken.value = ''
  loadedValues.value = {}
  formValues.value = {}
}

// ─── tab management ────────────────────────────────────────────────────────

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
    const data = await $fetch<Record<string, string>>(`/api/admin/settings?category=${tabId}`, {
      headers: { 'x-admin-key': adminToken.value },
    })

    const defaults: Record<string, unknown> = {}
    for (const field of step.configFields) {
      defaults[field.id] = field.defaultValue
    }

    const overlay: Record<string, unknown> = {}
    for (const field of step.configFields) {
      const raw = data[field.envKey]
      if (raw !== undefined) {
        overlay[field.id] = parseFieldValue(raw, field.type)
      }
    }

    const merged = { ...defaults, ...overlay }
    loadedValues.value[tabId] = merged
    formValues.value = { ...merged }
  } catch {
    const defaults: Record<string, unknown> = {}
    for (const field of (step?.configFields ?? [])) {
      defaults[field.id] = field.defaultValue
    }
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

// ─── save / reset ──────────────────────────────────────────────────────────

async function saveTab() {
  const step = currentStep.value
  if (!step) return
  saving.value = true
  saveStatus.value = null

  try {
    const promises = step.configFields.map((field) => {
      const val = formValues.value[field.id]
      const value = Array.isArray(val) ? (val as string[]).join(',') : String(val ?? '')
      return $fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'x-admin-key': adminToken.value },
        body: { key: field.envKey, value, category: activeTab.value },
      })
    })
    await Promise.all(promises)
    loadedValues.value[activeTab.value] = { ...formValues.value }
    saveStatus.value = { ok: true, message: t('settings.savedOk', { tab: activeTab.value }) }
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
    const promises = step.configFields.map((field) =>
      $fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'x-admin-key': adminToken.value },
        body: { key: field.envKey, value: '', category: activeTab.value },
      })
    )
    await Promise.all(promises)
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
