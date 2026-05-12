<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">

    <div class="wz-panel">
      <div class="wz-panel-header flex items-center gap-2">
        <span class="wz-accent">$</span>
        <span class="wz-label">admin --dashboard</span>
      </div>
      <div class="px-4 py-3 flex gap-2 text-xs hairline-t">
        <NuxtLink to="/admin/users" class="wz-btn-outline">manage users →</NuxtLink>
        <NuxtLink to="/admin/usage" class="wz-btn-outline">usage report →</NuxtLink>
        <NuxtLink to="/admin/settings" class="wz-btn-outline">settings →</NuxtLink>
      </div>
    </div>

    <div v-if="pending" class="wz-faint text-xs">loading…</div>
    <div v-else-if="error" class="text-xs" style="color: var(--term-danger)">⚠ {{ error.message }}</div>
    <template v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="wz-panel p-4 text-center">
          <div class="text-2xl font-bold wz-strong">{{ stats?.documents ?? '—' }}</div>
          <div class="text-[10px] uppercase tracking-widest wz-faint mt-1">documents</div>
        </div>
        <div class="wz-panel p-4 text-center">
          <div class="text-2xl font-bold wz-strong">{{ userCount }}</div>
          <div class="text-[10px] uppercase tracking-widest wz-faint mt-1">users</div>
        </div>
        <div class="wz-panel p-4 text-center">
          <div class="text-2xl font-bold wz-strong">{{ stats?.queries ?? '—' }}</div>
          <div class="text-[10px] uppercase tracking-widest wz-faint mt-1">queries</div>
        </div>
        <div class="wz-panel p-4 text-center">
          <div class="text-2xl font-bold wz-strong">
            {{ stats?.avgLatencyMs != null ? Math.round(stats.avgLatencyMs) + 'ms' : '—' }}
          </div>
          <div class="text-[10px] uppercase tracking-widest wz-faint mt-1">avg latency</div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-3">
        <div class="wz-panel p-4 text-xs space-y-1">
          <div class="wz-label mb-2">// latency</div>
          <div class="flex justify-between wz-faint">
            <span>p50</span><span>{{ stats?.p50LatencyMs != null ? Math.round(stats.p50LatencyMs) + 'ms' : '—' }}</span>
          </div>
          <div class="flex justify-between wz-faint">
            <span>p95</span><span>{{ stats?.p95LatencyMs != null ? Math.round(stats.p95LatencyMs) + 'ms' : '—' }}</span>
          </div>
          <div class="flex justify-between wz-faint">
            <span>tool call rate</span>
            <span>{{ stats?.toolCallRate != null ? (stats.toolCallRate * 100).toFixed(1) + '%' : '—' }}</span>
          </div>
        </div>
        <div class="wz-panel p-4 text-xs space-y-1">
          <div class="wz-label mb-2">// docs by status</div>
          <div
            v-for="(count, status) in stats?.documentsByStatus"
            :key="status"
            class="flex justify-between wz-faint"
          >
            <span>{{ status }}</span><span>{{ count }}</span>
          </div>
        </div>
      </div>

    </template>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['admin'] })

const { data: stats, pending, error } = useFetch('/api/admin/stats')
const { data: users } = useFetch('/api/admin/users')
const userCount = computed(() => users.value?.length ?? '—')
</script>
