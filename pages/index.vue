<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useEmbryoStore, type EmbryoState, type EmbryoSummary } from '~/stores/embryos'
import { LIFECYCLE, appendTranscript } from '~/utils/embryo-display'
import {
  FOSSIL_STRATUM_COPY,
  fossilStratum,
  hasOpenTension,
  tensionPriority,
  type FossilStratum,
} from '~/utils/embryo-lab'

const store = useEmbryoStore()
const { locale } = useTerminalPrefs()
const { t } = useI18n({ useScope: 'global' })

const seedInput = ref('')
const creating = ref(false)
/** Surface (living, tension-first) is the primary garden view — not a flat dump. */
const activeFilter = ref<EmbryoState | 'ALL' | 'SURFACE' | 'STRATA'>('SURFACE')

const speechLang = computed(() => (locale.value === 'es' ? 'es-ES' : 'en-US'))

const STRATA_ORDER: FossilStratum[] = ['recent', 'mid', 'deep']

function byTensionThenRecency(a: EmbryoSummary, b: EmbryoSummary) {
  const pa = tensionPriority(a)
  const pb = tensionPriority(b)
  if (pb !== pa) return pb - pa
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
}

const visible = computed(() => {
  let list: EmbryoSummary[]
  if (activeFilter.value === 'SURFACE') list = store.alive
  else if (activeFilter.value === 'STRATA') list = store.byState.FOSSIL
  else if (activeFilter.value === 'ALL') list = store.embryos
  else list = store.embryos.filter(e => e.state === activeFilter.value)

  return [...list].sort((a, b) => {
    if (activeFilter.value === 'STRATA') {
      const ta = a.fossilizedAt ? new Date(a.fossilizedAt).getTime() : 0
      const tb = b.fossilizedAt ? new Date(b.fossilizedAt).getTime() : 0
      return tb - ta
    }
    if (activeFilter.value === 'SURFACE') return byTensionThenRecency(a, b)
    if (a.state === 'FOSSIL' && b.state !== 'FOSSIL') return 1
    if (a.state !== 'FOSSIL' && b.state === 'FOSSIL') return -1
    return byTensionThenRecency(a, b)
  })
})

/** Surface sections: open tension/pending first, quiet living second. */
const surfaceSections = computed(() => {
  if (activeFilter.value !== 'SURFACE') return null
  const under: EmbryoSummary[] = []
  const quiet: EmbryoSummary[] = []
  for (const e of visible.value) {
    if (hasOpenTension(e)) under.push(e)
    else quiet.push(e)
  }
  return { under, quiet }
})

const strataGroups = computed(() => {
  if (activeFilter.value !== 'STRATA') return null
  const groups: Record<FossilStratum, EmbryoSummary[]> = { recent: [], mid: [], deep: [] }
  for (const e of visible.value) {
    groups[fossilStratum(e.fossilizedAt)].push(e)
  }
  return STRATA_ORDER
    .filter(s => groups[s].length > 0)
    .map(s => ({ stratum: s, ...FOSSIL_STRATUM_COPY[s], items: groups[s] }))
})

async function submitSeed() {
  const seed = seedInput.value.trim()
  if (!seed) return
  creating.value = true
  const embryo = await store.create(seed)
  creating.value = false
  if (embryo) {
    seedInput.value = ''
    await navigateTo(`/embryo/${embryo.id}`)
  }
}

function onSeedSpeech(transcript: string, isFinal: boolean) {
  if (!isFinal) return
  seedInput.value = appendTranscript(seedInput.value, transcript)
}

function filterLabel(f: typeof activeFilter.value) {
  if (f === 'ALL') return t('garden.all')
  if (f === 'SURFACE') return t('garden.surface')
  if (f === 'STRATA') return t('garden.strata')
  return `${LIFECYCLE.find(l => l.state === f)!.glyph} ${f.toLowerCase()}`
}

function filterCount(f: typeof activeFilter.value) {
  if (f === 'ALL') return store.embryos.length
  if (f === 'SURFACE') return store.alive.length
  if (f === 'STRATA') return store.byState.FOSSIL.length
  return store.byState[f].length
}

onMounted(() => store.fetchAll())
</script>

<template>
  <div class="max-w-3xl mx-auto px-3 sm:px-5 pt-12 sm:pt-14 pb-8 flex flex-col gap-4 sm:gap-5">

    <!-- seed capture (merged with garden header) -->
    <div class="wz-panel">
      <div class="wz-panel-header flex items-center justify-between">
        <span class="wz-label text-[10px]">New seed</span>
        <span class="wz-faint text-[10px]">{{ store.alive.length }} alive · {{ store.byState.FOSSIL.length }} fossil</span>
      </div>
      <div class="p-3 sm:p-4 flex gap-3">
        <textarea
          v-model="seedInput"
          rows="2"
          placeholder="Drop the seed..."
          aria-label="New seed"
          class="wz-field-bare flex-1"
          @keydown.meta.enter="submitSeed"
          @keydown.ctrl.enter="submitSeed"
        />
        <div class="flex flex-col gap-2 self-end">
          <AiSpeechInput
            class="hypar-speech"
            :language="speechLang"
            @result="onSeedSpeech"
          >
            <template #transcript />
            <template #unsupported />
          </AiSpeechInput>
          <button
            class="wz-btn-primary text-xs disabled:opacity-40"
            :disabled="!seedInput.trim() || creating"
            @click="submitSeed"
          >
            {{ creating ? '…' : 'Plant' }}
          </button>
        </div>
      </div>
    </div>

    <GardenPendingQueue />

    <!-- filter bar — surface (tension) first; strata secondary -->
    <div class="flex gap-1.5 sm:gap-2 flex-wrap">
      <button
        v-for="f in (['SURFACE', 'STRATA', 'ALL', ...LIFECYCLE.map(l => l.state)] as const)"
        :key="f"
        class="text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-1 border transition-colors rounded-full"
        :class="activeFilter === f
          ? 'border-[var(--term-accent)] wz-accent bg-[var(--term-accent-soft)]'
          : 'border-[var(--term-accent-faint)] wz-faint hover:border-[var(--term-accent-line)]'"
        @click="activeFilter = f"
      >
        {{ filterLabel(f) }}
        <span class="opacity-50 ml-0.5">{{ filterCount(f) }}</span>
      </button>
    </div>

    <!-- loading -->
    <div v-if="store.loading" class="wz-faint text-xs text-center py-8">scanning strata...</div>

    <!-- error -->
    <div v-else-if="store.error" class="text-[var(--term-danger)] text-xs p-3 border border-[var(--term-danger)]">
      error: {{ store.error }}
    </div>

    <!-- empty -->
    <div v-else-if="visible.length === 0" class="wz-faint text-xs text-center py-12">
      {{ store.embryos.length === 0 ? 'no embryos yet — plant the first seed' : 'no embryos in this state' }}
    </div>

    <!-- strata (fossils) -->
    <div v-else-if="strataGroups" class="flex flex-col gap-6">
      <section v-for="group in strataGroups" :key="group.stratum" class="flex flex-col gap-3">
        <div class="flex items-baseline justify-between px-1">
          <p class="text-[11px] wz-accent uppercase tracking-wider">{{ group.label }}</p>
          <p class="text-[10px] wz-faint">{{ group.depth }} · {{ group.items.length }}</p>
        </div>
        <GardenEmbryoCard
          v-for="e in group.items"
          :key="e.id"
          :embryo="e"
          :stratum="group.stratum"
        />
      </section>
    </div>

    <!-- surface: under tension → quiet -->
    <div v-else-if="surfaceSections" class="flex flex-col gap-6">
      <section v-if="surfaceSections.under.length" class="flex flex-col gap-2.5 sm:gap-3">
        <div class="flex items-baseline justify-between px-1">
          <p class="text-[11px] wz-accent uppercase tracking-wider">{{ t('garden.underTension') }}</p>
          <p class="text-[10px] wz-faint">{{ surfaceSections.under.length }}</p>
        </div>
        <GardenEmbryoCard v-for="e in surfaceSections.under" :key="e.id" :embryo="e" />
      </section>

      <section v-if="surfaceSections.quiet.length" class="flex flex-col gap-2.5 sm:gap-3">
        <div class="flex items-baseline justify-between px-1">
          <p class="text-[11px] wz-faint uppercase tracking-wider">{{ t('garden.quiet') }}</p>
          <p class="text-[10px] wz-faint">{{ surfaceSections.quiet.length }}</p>
        </div>
        <GardenEmbryoCard v-for="e in surfaceSections.quiet" :key="e.id" :embryo="e" class="opacity-80" />
      </section>
    </div>

    <!-- other filters (ALL / by-state) — still tension-first among living -->
    <div v-else class="flex flex-col gap-2.5 sm:gap-3">
      <GardenEmbryoCard v-for="e in visible" :key="e.id" :embryo="e" />
    </div>

  </div>
</template>
