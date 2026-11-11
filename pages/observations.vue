<script setup lang="ts">
import { AGENT_MOVES, MOVE_COPY } from '~/utils/embryo-method'
import { LIVING_STATES } from '~/utils/embryo-lab'
import { LIFECYCLE } from '~/utils/embryo-display'
import type { Observations } from '~/server/utils/observations'

const { data, pending, error, refresh } = await useFetch<Observations>('/api/observations', {
  server: false,
  default: () => null,
})

const states = LIVING_STATES
const moves = AGENT_MOVES

function glyph(state: string) {
  return LIFECYCLE.find(l => l.state === state)?.glyph ?? '◌'
}

function pct(rate: number | null): string {
  return rate == null ? '—' : `${Math.round(rate * 100)}%`
}

function stateTotal(state: string): number {
  const row = data.value?.moveByState[state]
  if (!row) return 0
  return moves.reduce((sum, m) => sum + (row[m] ?? 0), 0)
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-3 sm:px-5 pt-12 sm:pt-14 pb-8 flex flex-col gap-4 sm:gap-5">
    <NuxtLink to="/" class="wz-faint text-xs hover:wz-accent transition-colors">← Garden</NuxtLink>

    <div class="wz-panel">
      <div class="wz-panel-header flex items-center justify-between">
        <span class="wz-label">Observations</span>
        <span class="wz-faint text-[10px]">your garden · live signals</span>
      </div>
      <div class="p-4 flex flex-col gap-2">
        <p class="text-xs wz-muted">
          The signals behind the lab's open questions — read from your own events, not a survey.
          Turns recorded before this view lack a state and are left out of the matrix.
        </p>
        <button type="button" class="wz-btn-ghost text-[11px] self-start" @click="refresh()">refresh</button>
      </div>
    </div>

    <div v-if="pending" class="wz-faint text-xs text-center py-8">reading events…</div>
    <div v-else-if="error" class="text-[var(--term-danger)] text-xs p-3 border border-[var(--term-danger)] rounded-[var(--term-radius)]">
      could not load observations
    </div>

    <template v-else-if="data">
      <!-- totals -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div class="wz-panel p-3">
          <p class="text-[10px] wz-faint uppercase tracking-wider">embryos</p>
          <p class="text-lg wz-strong">{{ data.totals.embryos }}</p>
        </div>
        <div class="wz-panel p-3">
          <p class="text-[10px] wz-faint uppercase tracking-wider">agent turns</p>
          <p class="text-lg wz-strong">{{ data.totals.agentQuestions }}</p>
        </div>
        <div class="wz-panel p-3">
          <p class="text-[10px] wz-faint uppercase tracking-wider">links proposed</p>
          <p class="text-lg wz-strong">{{ data.totals.connectionsProposed }}</p>
        </div>
        <div class="wz-panel p-3">
          <p class="text-[10px] wz-faint uppercase tracking-wider">links accepted</p>
          <p class="text-lg wz-strong">{{ data.totals.connectionsAccepted }}</p>
        </div>
      </div>

      <!-- move × state — does the question depend on lifecycle state? -->
      <div class="wz-panel">
        <div class="wz-panel-header">
          <span class="wz-label">Move × state</span>
        </div>
        <div class="p-4 overflow-x-auto">
          <p class="text-[11px] wz-muted mb-3">
            If the move never changes with state, the stance is theatre. Diagonal-heavy is the goal.
          </p>
          <table class="w-full text-xs border-collapse">
            <thead>
              <tr class="wz-faint text-[10px] uppercase tracking-wider">
                <th class="text-left font-normal py-1 pr-3">state</th>
                <th v-for="m in moves" :key="m" class="text-center font-normal py-1 px-2" :title="MOVE_COPY[m]">
                  {{ m.toLowerCase() }}
                </th>
                <th class="text-right font-normal py-1 pl-2">turns</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in states" :key="s" class="border-t border-[var(--term-accent-faint)]">
                <td class="py-1.5 pr-3 wz-muted">
                  <span class="wz-faint mr-1">{{ glyph(s) }}</span>{{ s.toLowerCase() }}
                </td>
                <td
                  v-for="m in moves"
                  :key="m"
                  class="text-center py-1.5 px-2"
                  :class="data.moveByState[s]?.[m] ? 'wz-strong' : 'wz-faint opacity-40'"
                >
                  {{ data.moveByState[s]?.[m] ?? 0 }}
                </td>
                <td class="text-right py-1.5 pl-2 wz-faint">{{ stateTotal(s) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- paths + connections -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div class="wz-panel p-4 flex flex-col gap-1">
          <p class="text-[10px] wz-faint uppercase tracking-wider">paths in growing</p>
          <p class="text-2xl wz-strong">{{ pct(data.growingPaths.rate) }}</p>
          <p class="text-[11px] wz-muted">
            {{ data.growingPaths.withPaths }} of {{ data.growingPaths.total }} GROWING turns opened ≥1 path.
            <span v-if="data.growingPaths.total === 0" class="wz-faint">No GROWING turns recorded yet.</span>
          </p>
        </div>
        <div class="wz-panel p-4 flex flex-col gap-1">
          <p class="text-[10px] wz-faint uppercase tracking-wider">agent links accepted</p>
          <p class="text-2xl wz-strong">{{ pct(data.connectionAccept.rate) }}</p>
          <p class="text-[11px] wz-muted">
            {{ data.connectionAccept.accepted }} of {{ data.connectionAccept.proposed }} inferred links kept.
            <span v-if="data.connectionAccept.proposed === 0" class="wz-faint">No links proposed yet.</span>
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
