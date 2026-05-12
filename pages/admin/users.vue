<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">

    <div class="wz-panel">
      <div class="wz-panel-header flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="wz-accent">$</span>
          <span class="wz-label">admin --users</span>
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
            <th class="text-left px-4 py-3 wz-label font-medium uppercase tracking-widest">name</th>
            <th class="text-left px-4 py-3 wz-label font-medium uppercase tracking-widest">email</th>
            <th class="text-left px-4 py-3 wz-label font-medium uppercase tracking-widest">role</th>
            <th class="text-left px-4 py-3 wz-label font-medium uppercase tracking-widest">status</th>
            <th class="text-left px-4 py-3 wz-label font-medium uppercase tracking-widest">joined</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="hairline-b"
            :class="user.banned ? 'opacity-50' : ''"
          >
            <td class="px-4 py-3 wz-strong">{{ user.name }}</td>
            <td class="px-4 py-3 wz-faint">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span class="wz-pill">{{ user.role }}</span>
            </td>
            <td class="px-4 py-3 wz-faint">{{ user.banned ? 'banned' : 'active' }}</td>
            <td class="px-4 py-3 wz-faint">{{ formatDate(user.createdAt) }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button
                  type="button"
                  class="wz-btn-ghost text-[10px]"
                  @click="toggleRole(user)"
                >
                  {{ user.role === 'admin' ? '↓ user' : '↑ admin' }}
                </button>
                <button
                  type="button"
                  class="wz-btn-ghost text-[10px]"
                  style="color: var(--term-danger)"
                  @click="toggleBan(user)"
                >
                  {{ user.banned ? 'unban' : 'ban' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ['admin'] })

const { data: users, pending, error, refresh } = useFetch('/api/admin/users')

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

async function toggleRole(user: { id: string; role: string }) {
  await $fetch(`/api/admin/users/${user.id}`, {
    method: 'PATCH',
    body: { role: user.role === 'admin' ? 'user' : 'admin' },
  })
  await refresh()
}

async function toggleBan(user: { id: string; banned: boolean | null }) {
  await $fetch(`/api/admin/users/${user.id}`, {
    method: 'PATCH',
    body: { banned: !user.banned },
  })
  await refresh()
}
</script>
