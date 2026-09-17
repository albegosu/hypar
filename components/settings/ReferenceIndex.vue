<script setup lang="ts">
interface Snapshot {
  updatedAt: string
  commit: string | null
  topics: number
  chars: number
}

const { data: snapshot, refresh } = await useFetch<Snapshot | null>('/api/integrations/references', { default: () => null })

const clearing = ref(false)
const failure = ref<string | null>(null)

async function clear() {
  clearing.value = true
  failure.value = null
  try {
    await $fetch('/api/integrations/references', { method: 'DELETE' })
    await refresh()
  }
  catch {
    failure.value = 'could not clear the saved references.'
  }
  finally {
    clearing.value = false
  }
}
</script>

<template>
  <div>
    <p class="text-[10px] wz-faint uppercase tracking-wider mb-2">saved references</p>
    <p class="text-xs wz-muted mb-3">
      second-brain sends the index of your wiki after each capture: topic and pattern names with their summaries, never
      the saved posts. The agent reads it only while probing an idea or opening paths, as contrast — never as a
      recommendation.
    </p>
    <div v-if="snapshot" class="flex items-center gap-2 text-xs">
      <span class="wz-strong flex-1">
        {{ snapshot.topics }} topics · {{ Math.round(snapshot.chars / 1000) }} KB
      </span>
      <span class="wz-faint text-[10px]">
        updated {{ new Date(snapshot.updatedAt).toLocaleString() }}<template v-if="snapshot.commit"> · {{ snapshot.commit.slice(0, 7) }}</template>
      </span>
      <button type="button" class="wz-btn-ghost text-[11px] py-0.5 disabled:opacity-40" :disabled="clearing" @click="clear">
        clear
      </button>
    </div>
    <p v-else class="wz-faint text-[11px]">nothing received yet.</p>
    <p v-if="failure" class="text-[11px] text-[var(--term-danger)] mt-2">{{ failure }}</p>
  </div>
</template>
