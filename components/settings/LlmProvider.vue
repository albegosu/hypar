<script setup lang="ts">
import type { AiModelOption } from 'ai-elements-nuxt/types'
import { LLM_PROVIDERS, LLM_PROVIDER_INFO, type LlmProviderId } from '~/utils/llm-providers'

interface ProviderView {
  connection: {
    provider: LlmProviderId
    keyHint: string
    collaboratorModel: string | null
    updatedAt: string
  } | null
  fallback: { label: string; defaultModel: string }
}

const { selectedModel } = useLlmModel()

const { data: view, refresh: refreshView } = await useFetch<ProviderView>('/api/llm/provider')
const {
  data: modelList,
  pending: modelsPending,
  error: modelsError,
  refresh: refreshModels,
} = await useFetch<{ own: boolean; defaultModel: string; models: AiModelOption[] }>('/api/llm/models', { lazy: true })

const connection = computed(() => view.value?.connection ?? null)
const connectedInfo = computed(() => connection.value ? LLM_PROVIDER_INFO[connection.value.provider] : null)

const models = computed<AiModelOption[]>(() => {
  if (modelList.value?.models?.length) return modelList.value.models
  const id = currentModel.value
  return [{ id, name: id, provider: connectedInfo.value?.label ?? view.value?.fallback.label ?? 'Ollama' }]
})

/** Connected: the model stored with the connection. Fallback: the Settings cookie. */
const currentModel = computed({
  get: () => connection.value
    ? connection.value.collaboratorModel || connectedInfo.value!.defaultModel
    : selectedModel.value,
  set: (value: string) => {
    if (connection.value) void saveModel(value)
    else selectedModel.value = value
  },
})

const formOpen = ref(false)
const provider = ref<LlmProviderId>('ANTHROPIC')
const apiKey = ref('')
const busy = ref(false)
const failure = ref<string | null>(null)

function errorText(err: unknown, fallback: string): string {
  const e = err as { data?: { statusMessage?: string; message?: string }; statusMessage?: string }
  return e?.data?.statusMessage || e?.data?.message || e?.statusMessage || fallback
}

async function connect() {
  if (!apiKey.value.trim()) return
  busy.value = true
  failure.value = null
  try {
    view.value = await $fetch<ProviderView>('/api/llm/provider', {
      method: 'PUT',
      body: { provider: provider.value, apiKey: apiKey.value },
    })
    apiKey.value = ''
    formOpen.value = false
    await refreshModels()
  }
  catch (err) {
    failure.value = errorText(err, 'could not save the key.')
  }
  finally {
    busy.value = false
  }
}

async function saveModel(model: string) {
  if (!connection.value) return
  failure.value = null
  try {
    view.value = await $fetch<ProviderView>('/api/llm/provider', {
      method: 'PUT',
      body: { provider: connection.value.provider, collaboratorModel: model },
    })
  }
  catch (err) {
    failure.value = errorText(err, 'could not save the model.')
    await refreshView()
  }
}

async function disconnect() {
  busy.value = true
  failure.value = null
  try {
    view.value = await $fetch<ProviderView>('/api/llm/provider', { method: 'DELETE' })
    await refreshModels()
  }
  catch (err) {
    failure.value = errorText(err, 'could not disconnect.')
  }
  finally {
    busy.value = false
  }
}

function openForm() {
  provider.value = connection.value?.provider ?? 'ANTHROPIC'
  apiKey.value = ''
  failure.value = null
  formOpen.value = true
}
</script>

<template>
  <div>
    <p class="text-[10px] wz-faint uppercase tracking-wider mb-2">model provider</p>
    <p class="text-xs wz-muted mb-3">
      bring your own key. hypar stores it encrypted, never shows it again and only uses it for your agent turns.
    </p>

    <div class="flex items-center gap-2 text-xs mb-3">
      <span v-if="connection && connectedInfo" class="wz-strong flex-1">
        {{ connectedInfo.label }} · key ••••{{ connection.keyHint }}
      </span>
      <span v-else class="wz-muted flex-1">
        no provider connected — using the server default,
        <span class="wz-strong">{{ view?.fallback.label }}</span>.
      </span>
      <button
        v-if="!formOpen"
        type="button"
        class="wz-btn-outline text-[11px] py-0.5"
        @click="openForm"
      >
        {{ connection ? 'change' : 'connect' }}
      </button>
      <button
        v-if="connection && !formOpen"
        type="button"
        class="wz-btn-ghost text-[11px] py-0.5 disabled:opacity-40"
        :disabled="busy"
        @click="disconnect"
      >
        disconnect
      </button>
    </div>

    <form v-if="formOpen" class="flex flex-col gap-2 mb-3" @submit.prevent="connect">
      <div class="flex flex-wrap gap-1" role="radiogroup" aria-label="Provider">
        <button
          v-for="p in LLM_PROVIDERS"
          :key="p"
          type="button"
          role="radio"
          :aria-checked="provider === p"
          class="text-[11px] py-0.5"
          :class="provider === p ? 'wz-btn-primary' : 'wz-btn-outline'"
          @click="provider = p"
        >
          {{ LLM_PROVIDER_INFO[p].label }}
        </button>
      </div>
      <div class="flex items-center gap-2">
        <input
          v-model="apiKey"
          type="password"
          autocomplete="off"
          spellcheck="false"
          class="wz-input text-xs flex-1 wz-mono"
          :placeholder="LLM_PROVIDER_INFO[provider].keyPlaceholder"
          aria-label="API key"
        >
        <button type="submit" class="wz-btn-primary text-[11px] py-1 disabled:opacity-40" :disabled="busy || !apiKey.trim()">
          {{ busy ? 'checking…' : 'save' }}
        </button>
        <button type="button" class="wz-btn-ghost text-[11px] py-1" @click="formOpen = false">
          cancel
        </button>
      </div>
      <p class="wz-faint text-[10px]">
        get a key at
        <a class="underline" :href="LLM_PROVIDER_INFO[provider].keysUrl" target="_blank" rel="noopener">{{ LLM_PROVIDER_INFO[provider].keysUrl.replace('https://', '') }}</a>.
        hypar checks it with {{ LLM_PROVIDER_INFO[provider].label }} before saving.
      </p>
    </form>

    <p v-if="failure" class="text-[11px] text-[var(--term-danger)] mb-2">{{ failure }}</p>

    <p class="text-[10px] wz-faint uppercase tracking-wider mb-2 mt-1">collaborator model</p>
    <div v-if="modelsPending" class="wz-faint text-[11px]">listing models...</div>
    <p v-else-if="modelsError" class="text-[11px] text-[var(--term-danger)] mb-2">
      could not list models — using {{ currentModel }}.
      <button type="button" class="underline" @click="refreshModels()">retry</button>
    </p>
    <AiModelSelector
      v-if="!modelsPending"
      v-model="currentModel"
      :models="models"
      :group-by-provider="true"
    />
  </div>
</template>
