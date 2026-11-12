<script setup lang="ts">
import type { EmbryoSummary } from '~/stores/embryos'
import { isClosedState, type FossilStratum } from '~/utils/embryo-lab'
import { LIFECYCLE, stateColor } from '~/utils/embryo-display'
import { safeHttpUrl } from '~/utils/safe-url'

const props = defineProps<{
  embryo: EmbryoSummary
  /** When set, applies the fossil-strata depth styling (garden STRATA view). */
  stratum?: FossilStratum
}>()

const isFossil = computed(() => props.embryo.state === 'FOSSIL')
const isTransplanted = computed(() => props.embryo.state === 'TRANSPLANTED')
const isClosed = computed(() => isClosedState(props.embryo.state))
const glyph = computed(() => LIFECYCLE.find(l => l.state === props.embryo.state)!.glyph)
const openTensions = computed(() => props.embryo.tensions.filter(t => !t.resolved).length)
const links = computed(() => props.embryo._count.connections + props.embryo._count.connectedTo)

function hostOf(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '')
}
/** A seed that is only a link: it reads as a link, not as a sentence. */
const seedLink = computed(() => {
  const seed = props.embryo.seed.trim()
  return /^https?:\/\/\S+$/.test(seed) ? safeHttpUrl(seed) : null
})
/** What sparked the seed (a capture's link), so a card says what is behind it. */
const source = computed(() => {
  const url = safeHttpUrl(props.embryo.sourceUrl)
  const title = props.embryo.sourceTitle || null
  if (url) return { glyph: '↗', host: hostOf(url), title }
  // No link: an image capture, identified by its file name.
  return title ? { glyph: '▣', host: null, title } : null
})
const date = computed(() => {
  const iso = isFossil.value
    ? (props.embryo.fossilizedAt ?? props.embryo.createdAt)
    : isTransplanted.value
      ? (props.embryo.transplantedAt ?? props.embryo.createdAt)
      : props.embryo.createdAt
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
        <template v-if="!isClosed">
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
        :class="[isFossil ? 'text-[var(--term-text-dim)]' : 'wz-strong', seedLink ? 'break-all' : '']"
      >
        <span v-if="seedLink" class="wz-accent opacity-70" aria-label="link">↗ </span>{{ embryo.seed }}
      </p>
      <p
        v-if="source"
        class="text-[11px] wz-muted mt-2 line-clamp-1"
        :title="embryo.sourceUrl ?? undefined"
      >
        <span class="wz-accent opacity-70" aria-hidden="true">{{ source.glyph }}</span>
        <span v-if="source.host" class="wz-mono">{{ source.host }}</span><template v-if="source.host && source.title"> · </template><template v-if="source.title">{{ source.title }}</template>
      </p>
      <p
        v-if="isFossil && embryo.fossilReason"
        class="text-[11px] text-[var(--term-text-dim)] mt-2 opacity-60 line-clamp-1"
      >
        ◈ {{ embryo.fossilReason }}
      </p>
      <p
        v-if="isTransplanted && embryo.transplantReason"
        class="text-[11px] wz-muted mt-2 line-clamp-1"
      >
        ✳ {{ embryo.transplantReason }}
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
