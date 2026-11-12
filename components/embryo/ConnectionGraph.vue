<script setup lang="ts">
import type { ConnectionType, EmbryoDetail } from '~/stores/embryos'
import { CONNECTION_TYPES, LIFECYCLE, truncateSeed } from '~/utils/embryo-display'
import {
  COMPASS_DIRECTIONS,
  COMPASS_INNER_RING,
  COMPASS_OUTER_RING,
  compassEdge,
  layoutCompass,
  type CompassNeighbor,
  type CompassPlacement,
} from '~/utils/connection-compass'

const props = defineProps<{
  embryo: EmbryoDetail
  /** Closed embryos show the map but offer no confirm / dismiss. */
  readonly?: boolean
  /** Connection ids whose agent proposal is still pending, so Dismiss can withdraw it. */
  dismissable?: string[]
}>()

const emit = defineEmits<{
  confirm: [connectionId: string]
  dismiss: [connectionId: string]
}>()

// SVG frame: centre at (0,0), room for direction labels outside the outer ring.
const HALF_W = 250
const HALF_H = 196
const CENTER_R = 24
const viewBox = `${-HALF_W} ${-HALF_H} ${HALF_W * 2} ${HALF_H * 2}`

type Lens = 'all' | 'inferred' | ConnectionType

const lens = ref<Lens>('all')
const focusedId = ref<string | null>(null)
const settled = ref(false)

const neighbors = computed<CompassNeighbor[]>(() => {
  const seen = new Set<string>()
  const list: CompassNeighbor[] = []
  for (const c of props.embryo.connections) {
    if (seen.has(c.targetId)) continue
    seen.add(c.targetId)
    list.push({
      id: c.target.id,
      edgeId: c.id,
      seed: c.target.seed,
      state: c.target.state,
      type: c.type,
      inferred: c.detectedBy === 'AGENT' && !c.confirmedByUser,
      inbound: false,
      note: c.note,
    })
  }
  for (const c of props.embryo.connectedTo) {
    if (seen.has(c.sourceId) || c.sourceId === props.embryo.id) continue
    seen.add(c.sourceId)
    list.push({
      id: c.source.id,
      edgeId: c.id,
      seed: c.source.seed,
      state: c.source.state,
      type: c.type,
      inferred: c.detectedBy === 'AGENT' && !c.confirmedByUser,
      inbound: true,
      note: null,
    })
  }
  return list
})

const placements = computed(() => layoutCompass(neighbors.value))

const lensOptions = computed(() => {
  const counts = new Map<Lens, number>()
  for (const nb of neighbors.value) {
    counts.set(nb.type, (counts.get(nb.type) ?? 0) + 1)
    if (nb.inferred) counts.set('inferred', (counts.get('inferred') ?? 0) + 1)
  }
  const opts: Array<{ value: Lens; label: string; count: number }> = [
    { value: 'all', label: 'All', count: neighbors.value.length },
  ]
  for (const ct of CONNECTION_TYPES) {
    const count = counts.get(ct.value) ?? 0
    if (count) opts.push({ value: ct.value, label: ct.label, count })
  }
  const inferred = counts.get('inferred') ?? 0
  if (inferred) opts.push({ value: 'inferred', label: 'agent hypotheses', count: inferred })
  return opts
})

// Drop a lens whose last neighbour disappeared (confirmed / dismissed).
watch(lensOptions, (opts) => {
  if (!opts.some(o => o.value === lens.value)) lens.value = 'all'
})

function inLens(p: CompassPlacement) {
  if (lens.value === 'all') return true
  if (lens.value === 'inferred') return p.inferred
  return p.type === lens.value
}

const focused = computed(() =>
  placements.value.find(p => p.id === focusedId.value) ?? null,
)

const directionLabels = computed(() =>
  CONNECTION_TYPES.map((ct) => {
    const rad = (COMPASS_DIRECTIONS[ct.value] * Math.PI) / 180
    const dist = COMPASS_OUTER_RING + (Math.abs(Math.cos(rad)) > 0.5 ? 10 : 24)
    const x = Math.cos(rad) * dist
    const y = Math.sin(rad) * dist
    return {
      type: ct.value,
      label: ct.value === 'RESURRECTS' ? 'resurrects · from fossils' : ct.label,
      x,
      // Vertical labels sit just outside the ring; horizontal ones centre on it.
      y: Math.abs(y) > 1 ? y + Math.sign(y) * 4 : y,
      anchor: Math.abs(x) < 1 ? 'middle' : x > 0 ? 'start' : 'end',
      active: lens.value === 'all' || lens.value === ct.value,
      present: neighbors.value.some(n => n.type === ct.value),
    }
  }),
)

function glyphFor(state: string) {
  return LIFECYCLE.find(l => l.state === state)?.glyph ?? '◌'
}

function typeLabel(type: ConnectionType) {
  return CONNECTION_TYPES.find(ct => ct.value === type)?.label ?? type.toLowerCase()
}

function relationText(p: CompassPlacement) {
  return p.inbound
    ? `${typeLabel(p.type)} this idea`
    : `this idea ${typeLabel(p.type)} it`
}

function openNode(id: string) {
  navigateTo(`/embryo/${id}`)
}

function nodeTransform(p: CompassPlacement) {
  return settled.value ? `translate(${p.x}px, ${p.y}px)` : 'translate(0px, 0px)'
}

onMounted(() => {
  // Let the first frame paint at the centre so neighbours spring out to their place.
  // The timer covers background tabs, where animation frames never fire.
  const settle = () => { settled.value = true }
  requestAnimationFrame(() => requestAnimationFrame(settle))
  setTimeout(settle, 120)
})
</script>

<template>
  <div class="hypar-compass">
    <div v-if="lensOptions.length > 2" class="hypar-compass-lenses" role="toolbar" aria-label="Filter connections">
      <button
        v-for="opt in lensOptions"
        :key="opt.value"
        type="button"
        class="hypar-compass-lens"
        :aria-pressed="lens === opt.value"
        @click="lens = opt.value"
      >
        {{ opt.label }} <span class="wz-faint">{{ opt.count }}</span>
      </button>
    </div>

    <svg
      class="hypar-compass-svg"
      :viewBox="viewBox"
      role="group"
      :aria-label="`Connection compass for ${truncateSeed(embryo.seed, 60)}`"
      @mouseleave="focusedId = null"
    >
      <defs>
        <marker
          id="hypar-compass-head"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </marker>
      </defs>

      <circle class="hypar-compass-ring" :r="COMPASS_INNER_RING" />
      <circle class="hypar-compass-ring hypar-compass-ring--outer" :r="COMPASS_OUTER_RING" />
      <line class="hypar-compass-axis" :x1="-COMPASS_OUTER_RING" y1="0" :x2="COMPASS_OUTER_RING" y2="0" />
      <line class="hypar-compass-axis" x1="0" :y1="-COMPASS_OUTER_RING" x2="0" :y2="COMPASS_OUTER_RING" />

      <text
        v-for="d in directionLabels"
        :key="d.type"
        class="hypar-compass-direction"
        :class="{ 'is-dim': !d.active, 'is-empty': !d.present }"
        :x="d.x"
        :y="d.y"
        :text-anchor="d.anchor"
        dominant-baseline="central"
      >
        {{ d.label }}
      </text>

      <g class="hypar-compass-edges" :class="{ 'is-settled': settled }">
        <line
          v-for="p in placements"
          :key="p.edgeId"
          v-bind="compassEdge(p, CENTER_R)"
          class="hypar-compass-edge"
          :class="{
            'is-inferred': p.inferred,
            'is-dim': !inLens(p),
            'is-focused': focusedId === p.id,
          }"
          :marker-start="p.inbound ? 'url(#hypar-compass-head)' : undefined"
          :marker-end="p.inbound ? undefined : 'url(#hypar-compass-head)'"
        />
      </g>

      <g
        v-for="(p, i) in placements"
        :key="p.id"
        class="hypar-compass-node"
        :class="{
          'is-inferred': p.inferred,
          'is-fossil': p.state === 'FOSSIL',
          'is-dim': !inLens(p),
          'is-focused': focusedId === p.id,
        }"
        :style="{ transform: nodeTransform(p), transitionDelay: `${i * 35}ms` }"
        role="link"
        tabindex="0"
        :aria-label="`${truncateSeed(p.seed, 80)} — ${relationText(p)}${p.inferred ? ', agent hypothesis' : ''}`"
        @mouseenter="focusedId = p.id"
        @focus="focusedId = p.id"
        @click="openNode(p.id)"
        @keydown.enter.prevent="openNode(p.id)"
      >
        <circle class="hypar-compass-halo" :r="p.r + 7" />
        <circle class="hypar-compass-dot" :r="p.r" />
        <text class="hypar-compass-glyph" text-anchor="middle" dominant-baseline="central">{{ glyphFor(p.state) }}</text>
      </g>

      <g class="hypar-compass-center" :class="{ 'is-closed': readonly }">
        <circle :r="CENTER_R" />
        <text class="hypar-compass-glyph hypar-compass-glyph--center" text-anchor="middle" dominant-baseline="central">
          {{ glyphFor(embryo.state) }}
        </text>
      </g>
    </svg>

    <div class="hypar-compass-detail" aria-live="polite">
      <template v-if="focused">
        <div class="flex items-start gap-3">
          <div class="min-w-0 flex-1">
            <p class="text-xs wz-strong leading-snug line-clamp-2">{{ focused.seed }}</p>
            <p class="mt-1 text-[10px] wz-faint">
              {{ glyphFor(focused.state) }} {{ focused.state.toLowerCase() }}
              · {{ relationText(focused) }}
              · {{ focused.inferred ? 'agent hypothesis' : 'confirmed' }}
            </p>
            <p v-if="focused.note" class="mt-1 text-[11px] wz-muted line-clamp-2">{{ focused.note }}</p>
          </div>
          <div v-if="focused.inferred && !focused.inbound && !readonly" class="flex shrink-0 gap-1.5">
            <button type="button" class="wz-btn-outline text-[11px] py-0.5" @click="emit('confirm', focused.edgeId)">
              Confirm
            </button>
            <button
              v-if="dismissable?.includes(focused.edgeId)"
              type="button"
              class="wz-btn-ghost text-[11px] py-0.5"
              @click="emit('dismiss', focused.edgeId)"
            >
              Dismiss
            </button>
          </div>
        </div>
      </template>
      <p v-else-if="placements.length" class="text-[10px] wz-faint">
        Direction is the kind of link · inner ring = confirmed, dashed outer ring = agent hypothesis · size = how far it has grown. Hover a seed to read it, click to open.
      </p>
      <p v-else class="text-[10px] wz-faint">
        No connections yet. Links you draw land on the inner ring; the agent's hypotheses wait on the outer one.
      </p>
    </div>
  </div>
</template>
