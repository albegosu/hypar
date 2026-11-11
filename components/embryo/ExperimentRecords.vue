<script setup lang="ts">
// Experiment records (ADR 0012): compact list + add. Self-contained, so the embryo store stays untouched.
import { safeHttpUrl } from '~/utils/safe-url'
import { EXPERIMENT_VERDICTS, type ExperimentVerdictName } from '~/utils/embryo-experiments'

interface ExperimentRow {
  id: string
  hypothesis: string
  method: string
  status: 'PLANNED' | 'RUNNING' | 'CONCLUDED' | 'SUPERSEDED'
  result: string | null
  verdict: ExperimentVerdictName | null
  evidence: Array<{ note: string, url?: string }> | null
  supersededReason: string | null
}

const props = defineProps<{ embryoId: string, closed: boolean }>()

const open = ref(false)
const rows = ref<ExperimentRow[]>([])
const error = ref<string | null>(null)
const busy = ref(false)
const hypothesis = ref('')
const method = ref('')
/** Which row has its conclude/supersede form open, and which one. */
const form = ref<{ id: string, kind: 'conclude' | 'supersede' } | null>(null)
const result = ref('')
const verdict = ref<ExperimentVerdictName>('INCONCLUSIVE')
const evidenceNote = ref('')
const evidenceUrl = ref('')
const reason = ref('')

async function load() {
  try {
    rows.value = await $fetch<ExperimentRow[]>(`/api/embryos/${props.embryoId}/experiments`)
  }
  catch (e: any) {
    error.value = e?.data?.statusMessage ?? 'Failed to load experiments'
  }
}

async function call(fn: () => Promise<unknown>) {
  busy.value = true
  error.value = null
  try {
    await fn()
    await load()
    return true
  }
  catch (e: any) {
    error.value = e?.data?.statusMessage ?? 'Experiment update failed'
    return false
  }
  finally {
    busy.value = false
  }
}

async function add() {
  if (!hypothesis.value.trim() || !method.value.trim()) return
  const ok = await call(() => $fetch(`/api/embryos/${props.embryoId}/experiments`, {
    method: 'POST',
    body: { hypothesis: hypothesis.value, method: method.value },
  }))
  if (ok) { hypothesis.value = ''; method.value = '' }
}

function patch(expId: string, body: Record<string, unknown>) {
  return call(() => $fetch(`/api/embryos/${props.embryoId}/experiments/${expId}`, { method: 'PATCH', body }))
}

function openForm(id: string, kind: 'conclude' | 'supersede') {
  form.value = { id, kind }
  result.value = ''
  reason.value = ''
  evidenceNote.value = ''
  evidenceUrl.value = ''
  verdict.value = 'INCONCLUSIVE'
}

async function submitForm() {
  if (!form.value) return
  const { id, kind } = form.value
  const ok = kind === 'conclude'
    ? await patch(id, {
        action: 'conclude',
        result: result.value,
        verdict: verdict.value,
        evidence: evidenceNote.value.trim()
          ? [{ note: evidenceNote.value, url: evidenceUrl.value.trim() || undefined }]
          : [],
      })
    : await patch(id, { action: 'supersede', reason: reason.value })
  if (ok) form.value = null
}

const activeCount = computed(() => rows.value.filter(r => r.status !== 'SUPERSEDED').length)

onMounted(load)
watch(() => props.embryoId, load)
</script>

<template>
  <div class="wz-panel">
    <div class="wz-panel-header">
      <button type="button" class="wz-collapse-toggle" :aria-expanded="open" @click="open = !open">
        <span class="wz-label">
          Experiments
          <span class="wz-faint font-normal ml-2">{{ activeCount }}</span>
        </span>
        <span class="wz-faint text-[10px]">{{ open ? 'Hide' : 'Show' }}</span>
      </button>
    </div>
    <template v-if="open">
      <p v-if="error" class="px-4 pt-2 text-[11px] text-[var(--term-danger)]" role="alert">{{ error }}</p>
      <div class="divide-y divide-[var(--term-accent-faint)]">
        <div
          v-for="r in rows"
          :key="r.id"
          class="px-4 py-3 flex flex-col gap-1"
          :class="r.status === 'SUPERSEDED' ? 'opacity-40' : ''"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <span class="text-[10px] wz-faint mr-2">{{ r.status.toLowerCase() }}<template v-if="r.verdict"> · {{ r.verdict.toLowerCase() }}</template></span>
              <span class="text-xs wz-strong">{{ r.hypothesis }}</span>
            </div>
            <div v-if="!closed && r.status !== 'SUPERSEDED'" class="flex gap-3 shrink-0">
              <button v-if="r.status === 'PLANNED'" class="text-[10px] wz-faint hover:wz-accent" :disabled="busy" @click="patch(r.id, { action: 'start' })">Start</button>
              <button v-if="r.status !== 'CONCLUDED'" class="text-[10px] wz-faint hover:wz-accent" @click="openForm(r.id, 'conclude')">Conclude</button>
              <button class="text-[10px] wz-faint hover:wz-accent" @click="openForm(r.id, 'supersede')">Supersede</button>
            </div>
          </div>
          <p class="text-[11px] wz-muted">{{ r.method }}</p>
          <p v-if="r.result" class="text-[11px] wz-muted">Result: {{ r.result }}</p>
          <p v-for="(ev, i) in r.evidence ?? []" :key="i" class="text-[11px] wz-faint">
            {{ ev.note }}
            <a v-if="safeHttpUrl(ev.url)" :href="safeHttpUrl(ev.url)!" target="_blank" rel="noopener noreferrer" class="underline break-all">link</a>
          </p>
          <p v-if="r.supersededReason" class="text-[11px] wz-faint">Superseded: {{ r.supersededReason }}</p>

          <div v-if="form?.id === r.id" class="mt-2 flex flex-col gap-2">
            <template v-if="form.kind === 'conclude'">
              <input v-model="result" type="text" placeholder="What happened" class="bg-transparent text-xs wz-strong placeholder:wz-faint focus:outline-none">
              <select v-model="verdict" class="bg-transparent text-xs wz-strong focus:outline-none">
                <option v-for="v in EXPERIMENT_VERDICTS" :key="v" :value="v">{{ v.toLowerCase() }}</option>
              </select>
              <input v-model="evidenceNote" type="text" placeholder="Evidence (optional)" class="bg-transparent text-xs wz-strong placeholder:wz-faint focus:outline-none">
              <input v-model="evidenceUrl" type="url" placeholder="Evidence link (optional)" class="bg-transparent text-xs wz-strong placeholder:wz-faint focus:outline-none">
            </template>
            <input v-else v-model="reason" type="text" placeholder="Why it is superseded" class="bg-transparent text-xs wz-strong placeholder:wz-faint focus:outline-none">
            <div class="flex gap-3">
              <button
                class="wz-btn-outline text-[11px] py-0.5 disabled:opacity-40"
                :disabled="busy || (form.kind === 'conclude' ? !result.trim() : !reason.trim())"
                @click="submitForm"
              >
                Save
              </button>
              <button class="text-[10px] wz-faint" @click="form = null">Cancel</button>
            </div>
          </div>
        </div>
        <p v-if="rows.length === 0" class="px-4 py-3 wz-faint text-[11px]">No experiments recorded</p>
      </div>
      <div v-if="!closed" class="p-4 border-t border-[var(--term-accent-faint)] flex flex-col gap-2">
        <input v-model="hypothesis" type="text" placeholder="Hypothesis: if…, then…" class="bg-transparent text-xs wz-strong placeholder:wz-faint focus:outline-none">
        <div class="flex gap-3">
          <input v-model="method" type="text" placeholder="Method: how it gets tested" class="flex-1 bg-transparent text-xs wz-strong placeholder:wz-faint focus:outline-none" @keydown.enter="add">
          <button class="wz-btn-outline text-[11px] py-0.5 disabled:opacity-40" :disabled="busy || !hypothesis.trim() || !method.trim()" @click="add">Add</button>
        </div>
      </div>
    </template>
  </div>
</template>
