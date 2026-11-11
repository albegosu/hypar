<script setup lang="ts">
interface AgentSettingsView {
  autoEngage: boolean
  peerLimit: number
}

const PEER_LIMIT_MAX = 15

// Same key as the other sections so one save refreshes everything.
const { data: view } = await useFetch<AgentSettingsView>('/api/settings', { key: 'user-settings' })
const saving = ref(false)
const failure = ref<string | null>(null)

async function save(patch: Partial<AgentSettingsView>) {
  saving.value = true
  failure.value = null
  try {
    view.value = await $fetch<AgentSettingsView>('/api/settings', { method: 'PUT', body: patch })
  }
  catch {
    failure.value = 'could not save.'
  }
  finally {
    saving.value = false
  }
}

function onPeerLimit(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  if (Number.isInteger(value)) save({ peerLimit: Math.min(PEER_LIMIT_MAX, Math.max(0, value)) })
}
</script>

<template>
  <div v-if="view">
    <p class="text-[10px] wz-faint uppercase tracking-wider mb-2">agent</p>
    <p class="text-xs wz-muted mb-3">
      two open questions of the lab, in your hands: when the agent first speaks, and how much of the garden it sees.
    </p>

    <label class="flex items-center gap-2 text-xs mb-2">
      <input
        type="checkbox"
        :checked="view.autoEngage"
        :disabled="saving"
        @change="save({ autoEngage: ($event.target as HTMLInputElement).checked })"
      >
      <span class="wz-strong">engage on first open</span>
      <span class="wz-faint text-[10px]">off: a latent seed waits until you press Engage</span>
    </label>

    <label class="flex items-center gap-2 text-xs mb-2">
      <span class="wz-strong">living peers it sees</span>
      <input
        type="number"
        min="0"
        :max="PEER_LIMIT_MAX"
        :value="view.peerLimit"
        :disabled="saving"
        class="w-14 px-1 py-0.5 text-xs bg-transparent border border-[var(--term-border)]"
        @change="onPeerLimit"
      >
      <span class="wz-faint text-[10px]">0–{{ PEER_LIMIT_MAX }}, most recently touched first. Fossils stay at 5</span>
    </label>

    <p v-if="failure" class="text-[11px] text-[var(--term-danger)] mt-2">{{ failure }}</p>
  </div>
</template>
