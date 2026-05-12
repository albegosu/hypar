<template>
  <div class="flex items-start gap-2 font-mono text-[11px] leading-relaxed">
    <span
      class="shrink-0 w-5 text-center"
      :style="statusColor"
    >{{ statusGlyph }}</span>
    <span class="shrink-0" :style="statusColor">{{ label }}</span>
    <span
      v-if="detail"
      class="wz-faint truncate"
    >{{ detail }}</span>
    <span
      v-if="status === 'active'"
      class="ml-auto shrink-0 wz-accent animate-pulse"
    >{{ spinner }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: 'pending' | 'active' | 'done' | 'error'
  label: string
  detail?: string
}>()

const FRAMES = ['⣾', '⣿', '⡿', '⢿', '⣻', '⣽', '⣾']
const frame = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

watch(
  () => props.status,
  (s) => {
    if (s === 'active') {
      timer = setInterval(() => { frame.value = (frame.value + 1) % FRAMES.length }, 120)
    } else {
      if (timer) { clearInterval(timer); timer = null }
    }
  },
  { immediate: true },
)

onUnmounted(() => { if (timer) clearInterval(timer) })

const spinner = computed(() => FRAMES[frame.value])

const statusGlyph = computed(() => {
  switch (props.status) {
    case 'done': return '[✓]'
    case 'active': return '[~]'
    case 'error': return '[✗]'
    default: return '[ ]'
  }
})

const statusColor = computed(() => {
  switch (props.status) {
    case 'done': return 'color: var(--term-accent)'
    case 'active': return 'color: var(--term-accent)'
    case 'error': return 'color: var(--term-error, #f87171)'
    default: return 'color: var(--term-text-faint)'
  }
})
</script>
