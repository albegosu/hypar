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

    <div
      v-if="showProviderQuotaBanner"
      class="mb-5 wz-panel p-4 text-xs space-y-1"
      style="border-color: var(--term-accent);"
    >
      <p class="wz-accent font-mono">⚡ {{ t('settings.providerQuotaBanner') }}</p>
      <p class="wz-muted">{{ t('settings.providerQuotaBannerHint') }}</p>
    </div>

    <div class="mb-6">
      <h1 class="text-lg font-semibold wz-strong">{{ t('settings.userTitle') }}</h1>
      <p class="text-xs wz-faint mt-1">{{ t('settings.userSubtitle') }}</p>
    </div>

    <div class="space-y-4">
      <!-- Tab nav -->
      <div class="flex gap-1 text-xs flex-wrap">
        <button
          v-for="tab in SETTINGS_TABS"
          :key="tab.id"
          class="px-3 py-1.5 rounded transition-colors duration-150"
          :class="activeTab === tab.id ? 'wz-btn-outline font-semibold' : 'wz-btn-ghost'"
          :disabled="loadingTab"
          @click="onSwitchTab(tab.id)"
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

      <div
        v-if="loadError"
        class="wz-panel p-4 text-xs"
        style="border-color: var(--term-danger);"
      >
        <p class="wz-accent font-mono">⚠ {{ t('settings.loadErrorTitle') }}</p>
        <p class="wz-muted mt-1">{{ loadError }}</p>
        <p class="wz-faint mt-2">{{ t('settings.loadErrorHint') }}</p>
      </div>

      <div v-if="loadingTab" class="text-xs wz-faint py-4 text-center">{{ t('common.loading') }}</div>

      <!-- Config form -->
      <div v-else-if="currentStep && currentFields.length" class="space-y-4">
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

        <p
          v-if="activeTab === 'chunking' && uploadFormatsHint"
          class="text-[11px] wz-muted font-mono"
        >
          {{ uploadFormatsHint }}
        </p>

        <SetupWizardConfigForm
          :step-id="currentStep.id"
          :fields="currentFields"
          :model-value="formValues"
          :system-hints="systemHints"
          :use-system-hints="false"
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

      <div v-else-if="!loadingTab" class="text-xs wz-faint py-4 text-center">
        {{ t('settings.noFields') }}
      </div>

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
import SetupWizardConfigForm from '~/components/setup/WizardConfigForm.vue'
import {
  SETTINGS_TABS,
  useSettingsTabs,
  type SettingsTabId,
} from '~/composables/useSettingsTabs'
import { buildWizardDefaults, getStepFields } from '~/utils/settings-form'
import { parseUserSettingsResponse, userSettingValueForSave } from '~/utils/parse-user-settings'

const { t } = useI18n()
const route = useRoute()

const showRateLimitBanner = computed(() => route.query.reason === 'ratelimit')
const showProviderQuotaBanner = computed(() => route.query.reason === 'provider-quota')

const saving = ref(false)
const saveStatus = ref<{ ok: boolean; message: string } | null>(null)

const {
  activeTab,
  loadingTab,
  loadError,
  formValues,
  currentStep,
  currentFields,
  currentExtras,
  switchTab,
  invalidateAndReload,
} = useSettingsTabs({
  fetchUrl: (tabId) => `/api/user/settings?category=${tabId}`,
  parseResponse: parseUserSettingsResponse,
})

const systemHints = computed(
  () => (currentExtras.value.systemHints as Record<string, unknown> | undefined) ?? {},
)

const secretConfiguredMap = computed(
  () => (currentExtras.value.secretConfigured as Record<string, boolean> | undefined) ?? {},
)

const secretStatuses = computed(() => {
  const configured = secretConfiguredMap.value
  return currentFields.value
    .filter((f) => f.secret && f.envKey)
    .map((f) => ({ key: f.envKey!, configured: configured[f.envKey!] ?? false }))
})

const uploadFormatsHint = computed(() => {
  if (activeTab.value !== 'chunking') return ''
  const effective = currentExtras.value.effectiveAllowedFormats as string | undefined
  const wsOverride = currentExtras.value.workspaceOverrideAllowedFormats === true
  if (wsOverride && effective) {
    return t('settings.allowedFormatsWorkspaceOverride', { formats: effective })
  }
  if (effective) {
    return t('settings.allowedFormatsEffective', { formats: effective })
  }
  return t('settings.allowedFormatsUserHint')
})

function onSwitchTab(id: SettingsTabId) {
  saveStatus.value = null
  switchTab(id)
}

async function saveTab() {
  const step = currentStep.value
  if (!step) return
  const defaults = buildWizardDefaults(step)
  const hints = systemHints.value
  saving.value = true
  saveStatus.value = null
  try {
    await Promise.all(
      getStepFields(step)
        .filter((field) => field.envKey)
        .map((field) => {
          const toSave = userSettingValueForSave(field, formValues.value[field.id], defaults, hints)
          if (toSave === null) return Promise.resolve()
          return $fetch('/api/user/settings', {
            method: 'PUT',
            body: { key: field.envKey, value: toSave, category: activeTab.value },
          })
        }),
    )
    await invalidateAndReload()
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
    await invalidateAndReload()
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
