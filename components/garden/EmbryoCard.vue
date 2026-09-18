<script setup lang="ts">
import type { EmbryoSummary } from '~/stores/embryos'
import type { FossilStratum } from '~/utils/embryo-lab'
import { LIFECYCLE, stateColor } from '~/utils/embryo-display'

const props = defineProps<{
  embryo: EmbryoSummary
  /** When set, applies the fossil-strata depth styling (garden STRATA view). */
  stratum?: FossilStratum
}>()

const isFossil = computed(() => props.embryo.state === 'FOSSIL')
const glyph = computed(() => LIFECYCLE.find(l => l.state === props.embryo.state)!.glyph)
const openTensions = computed(() => props.embryo.tensions.filter(t => !t.resolved).length)
const links = computed(() => props.embryo._count.connections + props.embryo._count.connectedTo)
const date = computed(() => {
  const iso = isFossil.value ? (props.embryo.fossilizedAt ?? props.embryo.createdAt) : props.embryo.createdAt
  return new Date(iso).toLocaleDateString()
})
</script>

<template>
  <NuxtLink
    :to="`/embryo/${embryo.id}`"
    class="wz-panel group block transition-colors"
    :class="[
      isFossil ? 'fossil-card' : 'hover:border-[var(--term-accent-line)]',
      stratum ? `stratum-${stratum}` : '',
      embryo.state === 'GROWING' ? 'wz-live-glow' : '',
    ]"
  >
    <div class="wz-panel-header flex items-center justify-between">
      <span :class="['text-xs', stateColor(embryo.state)]">
        {{ glyph }} {{ embryo.state.toLowerCase() }}
      </span>
      <div class="flex items-center gap-2 sm:gap-3 wz-faint text-[10px]">
        <template v-if="!isFossil">
          <span v-if="links > 0" class="opacity-70 hidden sm:inline">⟶ {{ links }}</span>
          <span v-if="openTensions" class="text-[var(--term-warn)]">⚡ {{ openTensions }}</span>
          <span v-if="embryo.agentNotes.length" class="wz-accent opacity-70">↯ {{ embryo.agentNotes.length }}</span>
        </template>
        <span>{{ date }}</span>
      </div>
    </div>
    <div class="p-3 sm:p-4">
      <p
        class="text-sm leading-relaxed line-clamp-3"
        :class="isFossil ? 'text-[var(--term-text-dim)]' : 'wz-strong'"
      >
        {{ embryo.seed }}
      </p>
      <p
        v-if="isFossil && embryo.fossilReason"
        class="text-[11px] text-[var(--term-text-dim)] mt-2 opacity-60 line-clamp-1"
      >
        ◈ {{ embryo.fossilReason }}
      </p>
    </div>
  </NuxtLink>
</template>

<style scoped>
.fossil-card {
  opacity: 0.55;
  border-style: dashed !important;
  transition: opacity 0.15s ease;
}
.fossil-card:hover {
  opacity: 0.75;
}
/* Strata depth wins over the base fossil opacity (defined after on purpose). */
.stratum-recent { opacity: 0.78; }
.stratum-mid { opacity: 0.55; padding-left: 8px; }
.stratum-deep { opacity: 0.38; padding-left: 16px; }
</style>
