<script setup lang="ts">
// ADR 0010 (proposed): how this idea gets validated. The agent proposes it as an
// additive pending note; the user accepts it as is, edits it, or writes their own.
import {
  VALIDATION_PLAN_MAX,
  normalizeValidationPlan,
  planEditGuard,
  showPlanCard,
} from '~/utils/validation-plan'

const props = defineProps<{ embryoId: string }>()

const store = useEmbryoStore()
const embryo = computed(() => store.current)

const pending = computed(() =>
  embryo.value?.agentNotes.find(n => n.type === 'PENDING_VALIDATION_PLAN') ?? null,
)
const plan = computed(() => normalizeValidationPlan(embryo.value?.validationPlan))
const visible = computed(() =>
  !!embryo.value && embryo.value.id === props.embryoId
  && showPlanCard(embryo.value.state, plan.value, !!pending.value),
)
const editable = computed(() => !!embryo.value && !planEditGuard(embryo.value.state))

const editing = ref(false)
const draft = ref('')
const saving = ref(false)
/** The edit started from the agent's proposal, so saving also settles that note. */
const fromProposal = ref(false)

function startEdit(from: string, proposal = false) {
  draft.value = from
  fromProposal.value = proposal
  editing.value = true
}

async function save(noteId?: string) {
  const text = normalizeValidationPlan(draft.value)
  if (!text) return
  saving.value = true
  const ok = await store.saveValidationPlan(props.embryoId, text, noteId)
  saving.value = false
  if (ok) editing.value = false
}

async function acceptAsProposed() {
  if (!pending.value) return
  saving.value = true
  await store.saveValidationPlan(props.embryoId, pending.value.content, pending.value.id)
  saving.value = false
}

watch(() => props.embryoId, () => {
  editing.value = false
  draft.value = ''
})
</script>

<template>
  <div v-if="visible" class="wz-panel" data-testid="validation-plan">
    <div class="wz-panel-header flex items-center justify-between">
      <span class="wz-label">Validation plan</span>
      <button
        v-if="editable && !editing && plan"
        class="wz-btn-outline text-[11px] py-0.5"
        @click="startEdit(plan)"
      >
        Edit
      </button>
    </div>

    <div v-if="pending && editable && !editing" class="p-4 flex flex-col gap-2 border-b border-[var(--term-accent-faint)]">
      <p class="text-[10px] wz-faint">The agent proposes{{ plan ? ' a revision' : '' }}</p>
      <p class="text-xs wz-muted whitespace-pre-line">{{ pending.content }}</p>
      <div class="flex gap-2 justify-end">
        <button class="wz-btn-ghost text-xs" :disabled="saving" @click="store.dismissNote(embryoId, pending.id)">Dismiss</button>
        <button class="wz-btn-outline text-xs" :disabled="saving" @click="startEdit(pending.content, true)">Edit</button>
        <button class="wz-btn-primary text-xs disabled:opacity-40" :disabled="saving" @click="acceptAsProposed">
          {{ saving ? '…' : 'Accept' }}
        </button>
      </div>
    </div>

    <div v-if="editing" class="p-4 flex flex-col gap-2">
      <textarea
        v-model="draft"
        rows="5"
        class="wz-field-bare"
        :maxlength="VALIDATION_PLAN_MAX"
        placeholder="How would this idea be proved or killed, for this solution and this user?"
      />
      <div class="flex gap-2 justify-end">
        <button class="wz-btn-ghost text-xs" @click="editing = false">Cancel</button>
        <button
          class="wz-btn-primary text-xs disabled:opacity-40"
          :disabled="!normalizeValidationPlan(draft) || saving"
          @click="save(fromProposal && pending ? pending.id : undefined)"
        >
          {{ saving ? '…' : 'Save plan' }}
        </button>
      </div>
    </div>

    <div v-else-if="plan" class="p-4">
      <p class="text-xs wz-muted whitespace-pre-line break-words">{{ plan }}</p>
    </div>

    <div v-else-if="!pending" class="p-4 flex flex-col gap-2">
      <p class="text-[11px] wz-faint">No plan yet. The agent may propose one, or write your own.</p>
      <div v-if="editable" class="flex justify-end">
        <button class="wz-btn-outline text-xs" @click="startEdit('')">Write a plan</button>
      </div>
    </div>
  </div>
</template>
