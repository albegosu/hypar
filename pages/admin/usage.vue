<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">

    <div class="wz-panel">
      <div class="wz-panel-header flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="wz-accent">$</span>
          <span class="wz-label">admin --usage</span>
        </div>
        <NuxtLink to="/admin" class="wz-btn-ghost text-[10px]">← dashboard</NuxtLink>
      </div>
    </div>

    <div v-if="pending" class="wz-faint text-xs">loading…</div>
    <div v-else-if="error" class="text-xs" style="color: var(--term-danger)">⚠ {{ error.message }}</div>
    <div v-else class="wz-panel overflow-x-auto">
      <table class="w-full text-xs">
        <thead>
          <tr class="hairline-b">
            <th class="text-left px-4 py-3 wz-label font-medium uppercase tracking-widest">user</th>
            <th class="text-left px-4 py-3 wz-label font-medium uppercase tracking-widest">email</th>
            <th class="text-right px-4 py-3 wz-label font-medium uppercase tracking-widest">queries</th>
            <th class="text-right px-4 py-3 wz-label font-medium uppercase tracking-widest">avg latency</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in usage" :key="row.userId ?? 'anon'" class="hairline-b">
            <td class="px-4 py-3 wz-strong">{{ row.name ?? row.userId ?? 'anonymous' }}</td>
            <td class="px-4 py-3 wz-faint">{{ row.email ?? '—' }}</td>
            <td class="px-4 py-3 text-right wz-strong">{{ row.queryCount }}</td>
            <td class="px-4 py-3 text-right wz-faint">
              {{ row.avgLatencyMs != null ? Math.round(row.avgLatencyMs) + 'ms' : '—' }}
            </td>
          </tr>
          <tr v-if="!usage?.length">
            <td colspan="4" class="px-4 py-6 text-center wz-faint">no query data yet</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['admin'] })

const { data: usage, pending, error } = useFetch('/api/admin/usage')
</script>
