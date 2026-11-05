<script setup lang="ts">
interface SettingsView {
  webResearch: boolean
  autoResearch: boolean
  research: { available: true; label: string } | { available: false; reason: string }
}

// Keyed so the provider section can refresh it when the provider changes.
const { data: view } = await useFetch<SettingsView>('/api/settings', { key: 'user-settings' })
const saving = ref(false)
const failure = ref<string | null>(null)

async function save(patch: Partial<Pick<SettingsView, 'webResearch' | 'autoResearch'>>) {
  saving.value = true
  failure.value = null
  try {
    view.value = await $fetch<SettingsView>('/api/settings', { method: 'PUT', body: patch })
  }
  catch {
    failure.value = 'could not save.'
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="view">
    <p class="text-[10px] wz-faint uppercase tracking-wider mb-2">web research</p>
    <p class="text-xs wz-muted mb-3">
      the agent can search the web to refute and extend an idea. Each finding becomes an open tension with its source.
      The idea's text goes to your provider's search.
    </p>

    <label class="flex items-center gap-2 text-xs mb-2">
      <input
        type="checkbox"
        :checked="view.webResearch"
        :disabled="saving"
        @change="save({ webResearch: ($event.target as HTMLInputElement).checked })"
      >
      <span class="wz-strong">allow web research</span>
      <span class="wz-faint text-[10px]">a Research button on each embryo</span>
    </label>

    <label class="flex items-center gap-2 text-xs mb-2" :class="{ 'opacity-40': !view.webResearch }">
      <input
        type="checkbox"
        :checked="view.autoResearch"
        :disabled="saving || !view.webResearch"
        @change="save({ autoResearch: ($event.target as HTMLInputElement).checked })"
      >
      <span class="wz-strong">research automatically</span>
      <span class="wz-faint text-[10px]">once when an embryo enters germinating or maturing, before the question</span>
    </label>

    <p v-if="view.webResearch && view.research.available" class="wz-faint text-[11px]">
      searches run with {{ view.research.label }}.
    </p>
    <p v-else-if="view.webResearch && !view.research.available" class="text-[11px] wz-muted">
      {{ view.research.reason }}
    </p>
    <p v-if="failure" class="text-[11px] text-[var(--term-danger)] mt-2">{{ failure }}</p>
  </div>
</template>
