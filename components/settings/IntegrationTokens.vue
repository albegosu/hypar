<script setup lang="ts">
interface TokenRow {
  id: string
  name: string
  createdAt: string
  lastUsedAt: string | null
  revokedAt: string | null
}

const { data: tokens, refresh } = await useFetch<TokenRow[]>('/api/integrations/tokens', { default: () => [] })

const name = ref('second-brain')
const creating = ref(false)
const fresh = ref<string | null>(null)
const copied = ref(false)
const failure = ref<string | null>(null)

const active = computed(() => tokens.value.filter(t => !t.revokedAt))

async function create() {
  if (!name.value.trim()) return
  creating.value = true
  failure.value = null
  try {
    const row = await $fetch<TokenRow & { token: string }>('/api/integrations/tokens', {
      method: 'POST',
      body: { name: name.value },
    })
    fresh.value = row.token
    copied.value = false
    await refresh()
  }
  catch {
    failure.value = 'could not create the token.'
  }
  finally {
    creating.value = false
  }
}

async function copy() {
  if (!fresh.value) return
  await navigator.clipboard.writeText(fresh.value)
  copied.value = true
}

async function revoke(id: string) {
  failure.value = null
  try {
    await $fetch(`/api/integrations/tokens/${id}/revoke`, { method: 'POST' })
    await refresh()
  }
  catch {
    failure.value = 'could not revoke the token.'
  }
}

function when(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString() : 'never'
}
</script>

<template>
  <div>
    <p class="text-[10px] wz-faint uppercase tracking-wider mb-2">integrations</p>
    <p class="text-xs wz-muted mb-3">
      a token lets a tool plant seeds in your garden. With
      <a class="underline" href="https://github.com/albegosu/second-brain" target="_blank" rel="noopener">second-brain</a>,
      sharing a post as <span class="wz-strong">Idea to grow</span> turns your note into a latent embryo.
      Store it as <span class="wz-strong">HYPAR_TOKEN</span> in your wiki repository.
    </p>

    <div v-if="fresh" class="wz-flash wz-flash--ok mb-3 flex flex-col gap-2">
      <p class="text-[11px]">copy it now — it won't be shown again.</p>
      <div class="flex items-center gap-2">
        <code class="wz-mono text-[11px] break-all flex-1">{{ fresh }}</code>
        <button type="button" class="wz-btn-outline text-[11px] py-1" @click="copy">
          {{ copied ? 'copied' : 'copy' }}
        </button>
      </div>
    </div>

    <form class="flex items-center gap-2 mb-3" @submit.prevent="create">
      <input v-model="name" type="text" maxlength="60" class="wz-input text-xs flex-1" aria-label="Token name">
      <button type="submit" class="wz-btn-primary text-[11px] py-1 disabled:opacity-40" :disabled="creating || !name.trim()">
        {{ creating ? '…' : 'create token' }}
      </button>
    </form>

    <p v-if="failure" class="text-[11px] text-[var(--term-danger)] mb-2">{{ failure }}</p>

    <ul v-if="active.length" class="flex flex-col gap-1">
      <li v-for="t in active" :key="t.id" class="flex items-center gap-2 text-xs">
        <span class="wz-strong flex-1 truncate">{{ t.name }}</span>
        <span class="wz-faint text-[10px]">created {{ when(t.createdAt) }} · last used {{ when(t.lastUsedAt) }}</span>
        <button type="button" class="wz-btn-ghost text-[11px] py-0.5" @click="revoke(t.id)">revoke</button>
      </li>
    </ul>
    <p v-else class="wz-faint text-[11px]">no active tokens.</p>
  </div>
</template>
