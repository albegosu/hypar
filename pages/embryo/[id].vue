<script setup lang="ts">
import { useEmbryoStore, type EmbryoState, type ConnectionType, type EmbryoSummary } from '~/stores/embryos'
import {
  FOSSIL_KIND_COPY,
  FOSSIL_KINDS,
  METHOD_COPY,
  type FossilKind,
} from '~/utils/embryo-method'
import {
  CONNECTION_TYPES,
  LIFECYCLE,
  lifecycleStepIndex,
  nextLifecycleState,
  parseConnectionNote,
  stateColor,
} from '~/utils/embryo-display'
import { safeHttpUrl } from '~/utils/safe-url'
import { isClosedState } from '~/utils/embryo-lab'

const route = useRoute()
const store = useEmbryoStore()
const id = computed(() => route.params.id as string)

const tensionInput = ref('')
const fossilReason = ref('')
const fossilKind = ref<FossilKind | null>(null)
const showFossilDialog = ref(false)
const addingTension = ref(false)
const fossilizing = ref(false)
const resurrecting = ref(false)
const advancing = ref(false)
const showTransplantDialog = ref(false)
const transplantReason = ref('')
const transplantOutcome = ref('')
const transplanting = ref(false)
const noteInput = ref('')
const addingNote = ref(false)

const showConnectDialog = ref(false)
const connectSearch = ref('')
const connectType = ref<ConnectionType>('EXTENDS')
const connectNote = ref('')
const connecting = ref(false)
const connectCandidates = ref<Array<{ id: string; seed: string; state: EmbryoState }>>([])
const connectionView = ref<'list' | 'graph'>('graph')

const tensionsOpen = ref(false)
const historyOpen = ref(false)

// Web research (ADR 0007): findings land as sourced tensions.
const { data: userSettings } = useFetch<{
  research: { available: true; label: string } | { available: false; reason: string }
}>('/api/settings', { lazy: true, server: false })
const researchState = computed(() => userSettings.value?.research ?? null)
const researching = ref(false)
const researchMessage = ref<{ ok: boolean; text: string } | null>(null)

async function runResearch() {
  researching.value = true
  researchMessage.value = null
  const count = await store.research(id.value)
  researching.value = false
  tensionsOpen.value = true
  researchMessage.value = count === null
    ? { ok: false, text: store.error ?? 'Research failed' }
    : { ok: true, text: count ? `${count} sourced tension${count === 1 ? '' : 's'} added` : 'nothing relevant turned up' }
}

const filteredCandidates = computed(() => {
  const q = connectSearch.value.toLowerCase().trim()
  if (!q) return connectCandidates.value
  return connectCandidates.value.filter(e =>
    e.seed.toLowerCase().includes(q) || e.id.includes(q),
  )
})

async function openConnectDialog() {
  showConnectDialog.value = true
  connectSearch.value = ''
  const all = await $fetch<EmbryoSummary[]>('/api/embryos')
  const existing = new Set([
    id.value,
    ...(store.current?.connections.map(c => c.targetId) ?? []),
    ...(store.current?.connectedTo.map(c => c.sourceId) ?? []),
  ])
  connectCandidates.value = all
    .filter(e => !existing.has(e.id))
    .map(e => ({ id: e.id, seed: e.seed, state: e.state }))
}

const embryo = computed(() => store.current)
const isFossil = computed(() => embryo.value?.state === 'FOSSIL')
const isTransplanted = computed(() => embryo.value?.state === 'TRANSPLANTED')
/** Fossil or transplanted: no lifecycle, tension or connection changes (ADR 0003, ADR 0005). */
const isClosed = computed(() => !!embryo.value && isClosedState(embryo.value.state))
const transplantOutcomeUrl = computed(() => safeHttpUrl(embryo.value?.transplantOutcome))
const userNotes = computed(() =>
  (embryo.value?.events ?? []).filter(ev => ev.type === 'USER_NOTE' && ev.payload?.note),
)
const sourceUrl = computed(() => safeHttpUrl(embryo.value?.sourceUrl))
const sourceRef = computed(() => safeHttpUrl(embryo.value?.sourceRef))
const hasLinks = computed(() =>
  !!embryo.value && (embryo.value.connections.length > 0 || embryo.value.connectedTo.length > 0),
)
const nextState = computed(() =>
  embryo.value ? nextLifecycleState(embryo.value.state) : null,
)
const currentStepIdx = computed(() =>
  embryo.value ? lifecycleStepIndex(embryo.value.state) : -1,
)

watch(id, async (embryoId) => {
  await store.fetchOne(embryoId)
}, { immediate: true })

async function advanceLifecycle() {
  const next = nextState.value
  if (!next) return
  advancing.value = true
  await store.transition(id.value, next)
  advancing.value = false
}

async function submitTension() {
  const q = tensionInput.value.trim()
  if (!q) return
  addingTension.value = true
  await store.addTension(id.value, q)
  tensionInput.value = ''
  addingTension.value = false
}

async function submitFossilize() {
  if (!fossilReason.value.trim()) return
  fossilizing.value = true
  await store.fossilize(id.value, fossilReason.value.trim(), {
    kind: fossilKind.value ?? undefined,
  })
  showFossilDialog.value = false
  fossilReason.value = ''
  fossilKind.value = null
  fossilizing.value = false
}

async function submitTransplant() {
  const reason = transplantReason.value.trim()
  const outcome = transplantOutcome.value.trim()
  if (!reason || !outcome) return
  transplanting.value = true
  const ok = await store.transplant(id.value, reason, outcome)
  transplanting.value = false
  if (!ok) return
  showTransplantDialog.value = false
  transplantReason.value = ''
  transplantOutcome.value = ''
}

async function submitNote() {
  const note = noteInput.value.trim()
  if (!note) return
  addingNote.value = true
  const ok = await store.addNote(id.value, note)
  addingNote.value = false
  if (ok) noteInput.value = ''
}

function applyFossilKind(kind: FossilKind) {
  const prev = fossilKind.value
  fossilKind.value = kind
  const starter = FOSSIL_KIND_COPY[kind].starter
  const current = fossilReason.value
  if (!current.trim() || (prev && current.startsWith(FOSSIL_KIND_COPY[prev].starter))) {
    fossilReason.value = starter
  }
}

/** Agent proposal note behind an unconfirmed outgoing connection, if it is still pending. */
function proposalNoteFor(connectionId: string) {
  const c = embryo.value?.connections.find(c => c.id === connectionId)
  if (!c) return null
  return embryo.value?.agentNotes.find(n =>
    n.type === 'PENDING_CONNECTION' && parseConnectionNote(n.content)?.targetId === c.targetId,
  ) ?? null
}

async function confirmGraphConnection(connectionId: string) {
  // Accepting the proposal also clears it from the pending queue.
  const note = proposalNoteFor(connectionId)
  if (note) await store.acceptConnection(id.value, note.id)
  else await store.confirmConnection(id.value, connectionId)
}

async function dismissGraphConnection(connectionId: string) {
  const note = proposalNoteFor(connectionId)
  if (note) await store.dismissNote(id.value, note.id)
}

const dismissableConnectionIds = computed(() =>
  (embryo.value?.connections ?? [])
    .filter(c => !c.confirmedByUser && proposalNoteFor(c.id))
    .map(c => c.id),
)

async function submitConnection(targetId: string) {
  connecting.value = true
  await store.connect(id.value, targetId, connectType.value, connectNote.value.trim() || undefined)
  connectNote.value = ''
  connectSearch.value = ''
  showConnectDialog.value = false
  connecting.value = false
}

async function submitResurrect() {
  resurrecting.value = true
  const next = await store.resurrect(id.value)
  resurrecting.value = false
  if (next) await navigateTo(`/embryo/${next.id}`)
}

const EVENT_LABELS: Record<string, string> = {
  CREATED: 'created',
  STATE_CHANGED: 'state →',
  TENSION_ADDED: 'tension added',
  TENSION_RESOLVED: 'tension resolved',
  CONNECTION_MADE: 'connection',
  AGENT_QUESTION: 'agent asked',
  AGENT_SUGGESTION: 'agent suggested',
  USER_RESPONSE: 'responded',
  FOSSIL_PROPOSED: 'fossil proposed',
  FOSSILIZED: 'fossilized',
  TRANSPLANT_PROPOSED: 'transplant proposed',
  VALIDATION_PLAN_SET: 'validation plan saved',
  TRANSPLANTED: 'transplanted',
  USER_NOTE: 'note',
  RESEARCHED: 'researched the web',
  EXPERIMENT_ADDED: 'experiment added',
  EXPERIMENT_UPDATED: 'experiment updated',
  EXPERIMENT_SUPERSEDED: 'experiment superseded',
}

function stepClass(state: EmbryoState) {
  if (!embryo.value) return ''
  if (embryo.value.state === state) return 'is-current'
  const idx = lifecycleStepIndex(state)
  return idx < currentStepIdx.value ? 'is-done' : ''
}
</script>

<template>
  <div
    class="max-w-3xl mx-auto px-3 sm:px-5 pt-12 sm:pt-14 pb-8 flex flex-col gap-4 sm:gap-5"
    :class="{ 'fossil-view': isFossil }"
  >

    <NuxtLink to="/" class="wz-faint text-xs hover:wz-accent transition-colors">← Garden</NuxtLink>

    <div v-if="store.loading && !embryo" class="wz-faint text-xs text-center py-12">Excavating…</div>
    <div v-else-if="store.error && !embryo" class="text-[var(--term-danger)] text-xs p-3 border border-[var(--term-danger)] rounded-[var(--term-radius)]">
      Error: {{ store.error }}
    </div>

    <template v-else-if="embryo">

      <!-- 1. Seed + lifecycle stepper -->
      <div
        class="wz-panel"
        :class="{
          'fossil-panel': isFossil,
          'wz-live-glow': embryo.state === 'GROWING',
        }"
      >
        <div class="wz-panel-header flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <span :class="['text-xs', stateColor(embryo.state)]">
              {{ LIFECYCLE.find(l => l.state === embryo!.state)!.glyph }}
              {{ embryo.state.toLowerCase() }}
            </span>
            <span class="text-[10px] wz-faint hidden sm:inline truncate">
              {{ METHOD_COPY[embryo.state] }}
            </span>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button
              v-if="isFossil"
              class="wz-btn-outline text-[11px] py-1 disabled:opacity-40"
              :disabled="resurrecting"
              @click="submitResurrect"
            >
              {{ resurrecting ? '…' : 'Resurrect' }}
            </button>
            <span class="wz-faint text-[10px]">{{ new Date(embryo.createdAt).toLocaleString() }}</span>
          </div>
        </div>

        <div class="p-4 flex flex-col gap-4">
          <p class="text-base leading-relaxed" :class="isFossil ? 'text-[var(--term-text-dim)]' : 'wz-strong'">
            {{ embryo.seed }}
          </p>
          <details v-if="sourceUrl || sourceRef || embryo.sourceTitle" class="-mt-2 group">
            <summary class="text-[10px] wz-faint flex flex-wrap items-center gap-x-3 cursor-pointer list-none">
              <span>sparked by <span class="wz-muted">{{ embryo.sourceTitle || 'a capture' }}</span></span>
              <a v-if="sourceUrl" :href="sourceUrl" target="_blank" rel="noopener noreferrer" class="underline" @click.stop>original</a>
              <a v-if="sourceRef" :href="sourceRef" target="_blank" rel="noopener noreferrer" class="underline" @click.stop>source note</a>
              <span v-if="embryo.sourceContext" class="wz-faint group-open:hidden">show what it shows ↓</span>
            </summary>
            <AiMarkdown
              v-if="embryo.sourceContext"
              :content="embryo.sourceContext"
              class="mt-3 text-xs wz-muted leading-relaxed border-l border-[var(--term-accent-faint)] pl-3"
            />
          </details>
          <div v-if="isFossil && embryo.fossilReason" class="pt-3 border-t border-[var(--term-text-dim)] fossil-reason">
            <p class="text-[10px] text-[var(--term-text-dim)] uppercase tracking-wider mb-1">Cause of fossilization</p>
            <p class="text-xs text-[var(--term-text-dim)]">{{ embryo.fossilReason }}</p>
          </div>

          <div v-if="isTransplanted" class="pt-3 border-t border-[var(--term-accent-faint)] flex flex-col gap-2">
            <div>
              <p class="text-[10px] wz-faint uppercase tracking-wider mb-1">Became</p>
              <a
                v-if="transplantOutcomeUrl"
                :href="transplantOutcomeUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs wz-accent underline break-all"
              >{{ embryo.transplantOutcome }}</a>
              <p v-else class="text-xs wz-muted break-words">{{ embryo.transplantOutcome }}</p>
            </div>
            <div>
              <p class="text-[10px] wz-faint uppercase tracking-wider mb-1">Why it worked</p>
              <p class="text-xs wz-muted">{{ embryo.transplantReason }}</p>
            </div>
          </div>

          <div v-if="!isClosed" class="flex flex-col gap-3 pt-1">
            <div class="wz-stepper" aria-label="Lifecycle">
              <template v-for="(step, i) in LIFECYCLE" :key="step.state">
                <span
                  v-if="i > 0"
                  class="wz-step-sep"
                  aria-hidden="true"
                />
                <span
                  class="wz-step"
                  :class="stepClass(step.state)"
                >
                  <span aria-hidden="true">{{ step.glyph }}</span>
                  {{ step.label }}
                </span>
              </template>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-if="nextState"
                type="button"
                class="wz-btn-primary text-xs disabled:opacity-40"
                :disabled="advancing"
                @click="advanceLifecycle"
              >
                {{ advancing ? '…' : `Advance to ${LIFECYCLE.find(l => l.state === nextState)!.label}` }}
              </button>
              <span v-else class="text-[11px] wz-faint self-center">Validate it — then transplant or fossilize</span>
              <button
                v-if="embryo.state === 'MATURING'"
                type="button"
                class="wz-btn-outline text-xs ml-auto"
                @click="showTransplantDialog = true; showFossilDialog = false"
              >
                Transplant
              </button>
              <button
                type="button"
                class="wz-btn-danger text-xs"
                :class="{ 'ml-auto': embryo.state !== 'MATURING' }"
                @click="showFossilDialog = true; showTransplantDialog = false"
              >
                Fossilize
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Agent challenge (focal) -->
      <EmbryoAgentCollaborate :embryo-id="id" />

      <EmbryoValidationPlan :embryo-id="id" />

      <div v-if="showTransplantDialog && !isClosed" class="wz-panel">
        <div class="wz-panel-header">
          <span class="wz-accent text-xs">Transplant — it works and lives outside the garden</span>
        </div>
        <div class="p-4 flex flex-col gap-3">
          <input
            v-model="transplantOutcome"
            type="text"
            placeholder="What did it become? A link or where it lives (required)"
            class="wz-field-bare"
          >
          <textarea
            v-model="transplantReason"
            rows="2"
            placeholder="What made it work? (required)"
            class="wz-field-bare"
          />
          <div class="flex gap-2 justify-end">
            <button class="wz-btn-ghost text-xs" @click="showTransplantDialog = false">Cancel</button>
            <button
              class="wz-btn-primary text-xs disabled:opacity-40"
              :disabled="!transplantReason.trim() || !transplantOutcome.trim() || transplanting"
              @click="submitTransplant"
            >
              {{ transplanting ? '…' : 'Confirm transplant' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="isTransplanted" class="wz-panel">
        <div class="wz-panel-header">
          <span class="wz-label">Notes from outside</span>
        </div>
        <div v-if="userNotes.length" class="divide-y divide-[var(--term-accent-faint)]">
          <div v-for="ev in userNotes" :key="ev.id" class="px-4 py-2.5 flex gap-3">
            <span class="text-[10px] wz-faint shrink-0 w-28">{{ new Date(ev.createdAt).toLocaleString() }}</span>
            <span class="text-xs wz-muted break-words">{{ ev.payload?.note }}</span>
          </div>
        </div>
        <div class="p-4 border-t border-[var(--term-accent-faint)] flex gap-3">
          <input
            v-model="noteInput"
            type="text"
            placeholder="How is it doing out there?"
            class="wz-field-bare flex-1"
            @keydown.enter="submitNote"
          >
          <button
            class="wz-btn-outline text-xs disabled:opacity-40"
            :disabled="!noteInput.trim() || addingNote"
            @click="submitNote"
          >
            Add
          </button>
        </div>
      </div>

      <div v-if="showFossilDialog" class="wz-panel border-[var(--term-danger)]">
        <div class="wz-panel-header" style="border-color: var(--term-danger)">
          <span class="text-[var(--term-danger)] text-xs">Fossilize — this cannot be undone</span>
        </div>
        <div class="p-4 flex flex-col gap-3">
          <p class="text-[10px] wz-faint">Closing is evaluation — which kind of death?</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="kind in FOSSIL_KINDS"
              :key="kind"
              class="text-[11px] px-2.5 py-1 border rounded-full transition-colors"
              :class="fossilKind === kind
                ? 'border-[var(--term-danger)] text-[var(--term-danger)]'
                : 'border-[var(--term-accent-faint)] wz-faint hover:border-[var(--term-danger)]'"
              @click="applyFossilKind(kind)"
            >
              {{ FOSSIL_KIND_COPY[kind].label }}
            </button>
          </div>
          <textarea
            v-model="fossilReason"
            rows="2"
            placeholder="Why is this closing? (required)"
            class="wz-field-bare"
          />
          <div class="flex gap-2 justify-end">
            <button class="wz-btn-ghost text-xs" @click="showFossilDialog = false; fossilKind = null">Cancel</button>
            <button
              class="wz-btn-danger text-xs disabled:opacity-40"
              :disabled="!fossilReason.trim() || fossilizing"
              @click="submitFossilize"
            >
              {{ fossilizing ? '…' : 'Confirm fossilize' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Connections (empty graph shell always visible) -->
      <div class="wz-panel" :class="{ 'fossil-panel': isFossil }">
        <div class="wz-panel-header flex items-center justify-between gap-2">
          <span class="wz-label">Connections</span>
          <div class="flex items-center gap-2">
            <button
              class="text-[10px] px-2.5 py-0.5 border rounded-full transition-colors"
              :class="connectionView === 'graph'
                ? 'border-[var(--term-accent)] wz-accent bg-[var(--term-accent-soft)]'
                : 'border-[var(--term-accent-faint)] wz-faint'"
              @click="connectionView = 'graph'"
            >
              Graph
            </button>
            <button
              class="text-[10px] px-2.5 py-0.5 border rounded-full transition-colors"
              :class="connectionView === 'list'
                ? 'border-[var(--term-accent)] wz-accent bg-[var(--term-accent-soft)]'
                : 'border-[var(--term-accent-faint)] wz-faint'"
              @click="connectionView = 'list'"
            >
              List
            </button>
            <button
              v-if="!isClosed"
              class="wz-btn-outline text-[11px] py-0.5"
              @click="openConnectDialog"
            >
              Connect
            </button>
          </div>
        </div>

        <div v-if="showConnectDialog" class="px-4 py-3 border-b border-[var(--term-accent-faint)] flex flex-col gap-3">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="ct in CONNECTION_TYPES"
              :key="ct.value"
              class="text-[11px] px-2.5 py-0.5 border rounded-full transition-colors"
              :class="connectType === ct.value
                ? 'border-[var(--term-accent)] wz-accent bg-[var(--term-accent-soft)]'
                : 'border-[var(--term-accent-faint)] wz-faint hover:border-[var(--term-accent-line)]'"
              @click="connectType = ct.value"
            >
              {{ ct.glyph }} {{ ct.label }}
            </button>
          </div>
          <input
            v-model="connectSearch"
            type="text"
            placeholder="Search embryos…"
            class="bg-transparent text-xs wz-strong placeholder:wz-faint focus:outline-none w-full border-b border-[var(--term-accent-faint)] pb-2"
          />
          <div class="max-h-48 overflow-y-auto flex flex-col gap-1">
            <button
              v-for="candidate in filteredCandidates.slice(0, 10)"
              :key="candidate.id"
              class="text-left px-2 py-1.5 text-xs hover:bg-[var(--term-accent-soft)] transition-colors flex items-center gap-2 group rounded-[var(--term-radius)]"
              :disabled="connecting"
              @click="submitConnection(candidate.id)"
            >
              <span :class="['text-[10px] shrink-0', stateColor(candidate.state)]">
                {{ LIFECYCLE.find(l => l.state === candidate.state)?.glyph }}
              </span>
              <span class="wz-muted truncate flex-1 group-hover:wz-strong">{{ candidate.seed }}</span>
            </button>
            <p v-if="filteredCandidates.length === 0" class="text-[11px] wz-faint py-2 text-center">
              {{ connectCandidates.length === 0 ? 'No other embryos available' : 'No matches' }}
            </p>
          </div>
          <input
            v-model="connectNote"
            type="text"
            placeholder="Note (optional)"
            class="bg-transparent text-xs wz-strong placeholder:wz-faint focus:outline-none w-full"
          />
          <div class="flex justify-end">
            <button class="wz-btn-ghost text-xs" @click="showConnectDialog = false">Cancel</button>
          </div>
        </div>

        <EmbryoConnectionGraph
          v-if="connectionView === 'graph'"
          :embryo="embryo"
          :readonly="isClosed"
          :dismissable="dismissableConnectionIds"
          @confirm="confirmGraphConnection"
          @dismiss="dismissGraphConnection"
        />

        <div v-if="connectionView === 'list' && hasLinks" class="divide-y divide-[var(--term-accent-faint)]">
          <div
            v-for="c in embryo.connections"
            :key="c.id"
            class="flex items-center gap-3 px-4 py-3"
          >
            <span class="text-[10px] wz-faint w-20 shrink-0">{{ c.type.toLowerCase() }}</span>
            <NuxtLink
              :to="`/embryo/${c.targetId}`"
              class="text-xs wz-muted truncate flex-1 hover:wz-accent transition-colors"
            >
              {{ c.target.seed }}
            </NuxtLink>
            <button
              v-if="!c.confirmedByUser && !isClosed"
              class="text-[10px] text-[var(--term-warn)] hover:wz-accent shrink-0 transition-colors"
              @click="store.confirmConnection(id, c.id)"
            >
              Confirm
            </button>
            <span v-else-if="!c.confirmedByUser" class="text-[10px] text-[var(--term-warn)] shrink-0">Unconfirmed</span>
          </div>
          <NuxtLink
            v-for="c in embryo.connectedTo"
            :key="c.id"
            :to="`/embryo/${c.sourceId}`"
            class="flex items-center gap-3 px-4 py-3 hover:bg-[var(--term-accent-soft)] transition-colors"
          >
            <span class="text-[10px] wz-faint w-20 shrink-0">← {{ c.type.toLowerCase() }}</span>
            <span class="text-xs wz-muted truncate">{{ c.source.seed }}</span>
          </NuxtLink>
        </div>
        <div v-else-if="connectionView === 'list' && !showConnectDialog" class="px-4 py-3 wz-faint text-[11px]">No connections yet</div>
      </div>

      <!-- 4. Tensions (collapsed by default) -->
      <div class="wz-panel" :class="{ 'fossil-panel': isFossil }">
        <div class="wz-panel-header flex items-center gap-2">
          <button
            type="button"
            class="wz-collapse-toggle flex-1 min-w-0"
            :aria-expanded="tensionsOpen"
            @click="tensionsOpen = !tensionsOpen"
          >
            <span class="wz-label">
              Tensions
              <span class="wz-faint font-normal ml-2">{{ embryo.tensions.filter(t => !t.resolved).length }} open</span>
            </span>
            <span class="wz-faint text-[10px]">{{ tensionsOpen ? 'Hide' : 'Show' }}</span>
          </button>
          <button
            v-if="!isClosed && researchState"
            type="button"
            class="wz-btn-outline text-[11px] py-0.5 shrink-0 disabled:opacity-40"
            :disabled="researching || !researchState.available"
            :title="researchState.available
              ? `Search the web with ${researchState.label} to refute and extend this idea. The idea's text is sent to its search.`
              : researchState.reason"
            @click="runResearch"
          >
            {{ researching ? 'Searching…' : 'Research' }}
          </button>
        </div>
        <p
          v-if="researchMessage"
          class="px-4 pt-2 text-[11px]"
          :class="researchMessage.ok ? 'wz-faint' : 'text-[var(--term-danger)]'"
          role="status"
        >
          {{ researchMessage.text }}
        </p>
        <template v-if="tensionsOpen">
          <div class="divide-y divide-[var(--term-accent-faint)]">
            <div
              v-for="t in embryo.tensions"
              :key="t.id"
              class="px-4 py-3 flex items-start justify-between gap-3"
              :class="t.resolved ? 'opacity-40' : ''"
            >
              <div class="min-w-0">
                <span class="text-[10px] wz-faint mr-2">{{ t.stance ? t.stance.toLowerCase() : t.raisedBy.toLowerCase() }}</span>
                <span class="text-xs wz-strong">{{ t.question }}</span>
                <p v-if="t.claim" class="text-[11px] wz-muted mt-1">
                  {{ t.claim }}
                  <a
                    v-if="safeHttpUrl(t.sourceUrl)"
                    :href="safeHttpUrl(t.sourceUrl)!"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="underline wz-faint break-all"
                  >{{ t.sourceTitle || 'source' }}</a>
                </p>
              </div>
              <button
                v-if="!t.resolved && !isClosed"
                class="text-[10px] wz-faint hover:wz-accent shrink-0 transition-colors"
                @click="store.resolveTension(id, t.id)"
              >
                Resolve
              </button>
              <span v-else-if="t.resolved" class="text-[10px] wz-faint shrink-0">Resolved</span>
            </div>
            <p v-if="embryo.tensions.length === 0" class="px-4 py-3 wz-faint text-[11px]">No tensions yet</p>
          </div>
          <div v-if="!isClosed" class="p-4 border-t border-[var(--term-accent-faint)] flex gap-3">
            <input
              v-model="tensionInput"
              type="text"
              placeholder="Add an open question…"
              class="flex-1 bg-transparent text-xs wz-strong placeholder:wz-faint focus:outline-none"
              @keydown.enter="submitTension"
            />
            <button
              class="wz-btn-outline text-[11px] py-0.5 disabled:opacity-40"
              :disabled="!tensionInput.trim() || addingTension"
              @click="submitTension"
            >
              Add
            </button>
          </div>
        </template>
      </div>

      <EmbryoExperimentRecords :embryo-id="id" :closed="isClosed" />

      <!-- History (collapsed by default) -->
      <div class="wz-panel" :class="{ 'fossil-panel': isFossil }">
        <div class="wz-panel-header">
          <button
            type="button"
            class="wz-collapse-toggle"
            :aria-expanded="historyOpen"
            @click="historyOpen = !historyOpen"
          >
            <span class="wz-label">
              History
              <span class="wz-faint font-normal ml-2">{{ embryo.events.length }} events</span>
            </span>
            <span class="wz-faint text-[10px]">{{ historyOpen ? 'Hide' : 'Show' }}</span>
          </button>
        </div>
        <div v-if="historyOpen" class="divide-y divide-[var(--term-accent-faint)]">
          <div
            v-for="ev in [...embryo.events].reverse()"
            :key="ev.id"
            class="px-4 py-2.5 flex items-center gap-3"
          >
            <span class="text-[10px] wz-faint shrink-0 w-28">{{ new Date(ev.createdAt).toLocaleString() }}</span>
            <span class="text-[10px] wz-faint w-14 shrink-0">{{ ev.initiatedBy.toLowerCase() }}</span>
            <span class="text-xs wz-muted">{{ EVENT_LABELS[ev.type] ?? ev.type.toLowerCase() }}</span>
            <span v-if="ev.payload?.to" class="text-[10px] wz-accent">{{ ev.payload.to }}</span>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<style scoped>
.fossil-view {
  position: relative;
}
.fossil-view::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    color-mix(in srgb, var(--term-text-dim) 4%, transparent) 3px,
    color-mix(in srgb, var(--term-text-dim) 4%, transparent) 4px
  );
  z-index: 0;
}

.fossil-panel {
  opacity: 0.75;
  border-style: dashed !important;
}

.fossil-reason {
  border-style: dashed;
  opacity: 0.8;
}
</style>
