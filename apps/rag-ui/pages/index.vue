<template>
  <div class="max-w-5xl mx-auto px-4 py-6 flex flex-col min-h-[calc(100dvh-5.5rem)]">
    <!-- Header panel -->
    <section class="wz-panel mb-5">
      <div class="wz-panel-header flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="wz-accent">$</span>
          <span class="wz-label">chat --rag --agent</span>
        </div>
        <span class="wz-faint text-[10px]">{{ store.documents.length }} docs · ctx</span>
      </div>
      <div class="p-4">
        <h1 class="text-lg font-semibold wz-strong">// {{ t('chat.title') }}</h1>
        <p class="wz-muted text-xs mt-1">{{ t('chat.subtitle') }}</p>
      </div>
    </section>

    <div class="flex-1 flex flex-col lg:flex-row gap-6 items-start">
      <div class="flex-1 min-w-0 flex flex-col">
        <!-- Messages -->
        <div
          ref="scrollRef"
          class="flex-1 overflow-y-auto space-y-3 mb-0 pb-3 min-h-[12rem]"
        >
          <div v-if="!chatMessages.length" class="wz-panel p-6 text-center text-sm">
            <div class="text-2xl mb-2">▌</div>
            <p class="wz-muted">{{ t('chat.empty') }}</p>
          </div>

          <div
            v-for="(msg, idx) in chatMessages"
            :key="idx"
            class="flex"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[90%] rounded-md px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed"
              :class="msg.role === 'user' ? 'bubble-user' : 'bubble-assistant'"
            >
              <div
                v-if="msg.role === 'user'"
                class="wz-faint text-[10px] mb-1 font-mono"
              >
                &gt; user
              </div>
              <div
                v-if="msg.role === 'assistant'"
                class="wz-faint text-[10px] mb-1 font-mono flex items-center gap-2"
              >
                <span>&lt; agent</span>
                <span v-if="msg.usedKb === true" class="wz-pill">{{ t('chat.kbHit') }}</span>
                <span v-else-if="msg.usedKb === false" class="wz-pill wz-pill-dashed">{{ t('chat.kbMiss') }}</span>
              </div>

              {{ msg.content }}

              <div
                v-if="msg.role === 'assistant' && msg.sources?.length"
                class="mt-2 pt-2 border-t text-xs"
                style="border-color: var(--term-accent-faint)"
              >
                <span class="wz-faint">{{ t('chat.sources') }}:</span>
                <span
                  v-for="(s, i) in msg.sources"
                  :key="s.id"
                  class="inline"
                >
                  <NuxtLink
                    :to="`/documents/${s.id}`"
                    class="wz-accent hover:underline"
                  >{{ s.title }}</NuxtLink>{{ i < msg.sources.length - 1 ? ', ' : '' }}
                </span>
              </div>

              <div
                v-if="msg.role === 'assistant' && msg.results?.length"
                class="mt-2 pt-2 border-t"
                style="border-color: var(--term-accent-faint)"
              >
                <button
                  type="button"
                  class="wz-btn-ghost text-[11px] inline-flex items-center gap-1"
                  @click="msg.expanded = !msg.expanded"
                >
                  <UIcon
                    name="i-heroicons-chevron-down"
                    class="w-3 h-3 transition-transform"
                    :class="msg.expanded ? 'rotate-180' : ''"
                  />
                  {{ msg.expanded ? t('chat.hideRetrieval') : t('chat.showRetrieval') }}
                  ({{ msg.results.length }} {{ t('chat.chunks') }})
                </button>
                <div v-if="msg.expanded" class="mt-2 space-y-1.5">
                  <div
                    v-for="(r, i) in msg.results"
                    :key="r.chunkId"
                    class="text-xs wz-panel p-2"
                  >
                    <div class="flex items-center justify-between text-[10px] wz-faint mb-1 font-mono">
                      <span>#{{ i + 1 }} · {{ r.documentTitle }}</span>
                      <span class="wz-accent">{{ t('chat.score') }} {{ r.score.toFixed(3) }}</span>
                    </div>
                    <p class="whitespace-pre-wrap wz-muted line-clamp-3">{{ r.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="sending" class="flex justify-start">
            <div class="bubble-assistant rounded-md px-3 py-2 text-sm flex items-center gap-2">
              <span class="inline-flex gap-1">
                <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background: var(--term-accent)" />
                <span class="w-1.5 h-1.5 rounded-full animate-pulse [animation-delay:120ms]" style="background: var(--term-accent)" />
                <span class="w-1.5 h-1.5 rounded-full animate-pulse [animation-delay:240ms]" style="background: var(--term-accent)" />
              </span>
              <span class="wz-muted">{{ t('chat.thinking') }}</span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="shrink-0 space-y-2 sticky bottom-14 z-60 glass hairline-t pb-safe">
          <div class="flex items-center gap-2 wz-panel px-3 py-2">
            <span class="wz-accent text-sm select-none">&gt;</span>
            <input
              v-model="input"
              type="text"
              :placeholder="t('chat.placeholder')"
              class="wz-input flex-1 border-0 bg-transparent !p-0 focus:!shadow-none"
              style="background: transparent; border: 0;"
              :disabled="sending"
              @keyup.enter="send"
            >
            <button
              type="button"
              class="wz-btn-primary text-xs"
              :disabled="!input.trim() || sending"
              @click="send"
            >
              {{ sending ? '…' : `${t('chat.send')} ▶` }}
            </button>
          </div>
          <div
            v-if="showCommandHelp && filteredCommands.length"
            class="wz-panel px-3 py-2 space-y-1 text-[11px]"
          >
            <div class="wz-faint mb-1">
              // comandos disponibles
            </div>
            <div
              v-for="cmd in filteredCommands"
              :key="cmd.name"
              class="flex flex-col"
            >
              <span class="wz-accent font-mono">{{ cmd.name }}</span>
              <span class="wz-muted">{{ cmd.description }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <button
              v-if="chatMessages.length"
              type="button"
              class="wz-btn-ghost text-[10px]"
              @click="clearChat"
            >
              ✕ {{ t('chat.clear') }}
            </button>
            <span v-else />
          </div>
        </div>
      </div>

      <!-- Recent documents -->
      <section
        class="mt-8 pt-6 hairline-t shrink-0 lg:mt-0 lg:pt-0 lg:pl-6 lg:border-l lg:border-[color:var(--term-accent-line)] lg:border-t-0 lg:w-80 w-full"
      >
        <h2 class="text-[10px] uppercase tracking-widest wz-label mb-3">
          // {{ t('chat.recentDocs') }}
        </h2>
        <div v-if="store.loading" class="space-y-2">
          <div
            v-for="i in 3"
            :key="i"
            class="wz-panel h-12 animate-pulse"
            style="background: var(--term-accent-soft)"
          />
        </div>
        <div v-else-if="store.documents.length" class="space-y-2">
          <button
            v-for="doc in store.documents.slice(0, 5)"
            :key="doc.id"
            type="button"
            class="wz-panel card-hover cursor-pointer w-full text-left p-3 flex items-center gap-3"
            @click="navigateTo(`/documents/${doc.id}`)"
          >
            <div class="w-8 h-8 shrink-0 rounded-md flex items-center justify-center" style="background: var(--term-accent-soft); border: 1px solid var(--term-accent-line)">
              <UIcon
                :name="getIconForType(doc.sourceType)"
                class="w-4 h-4 wz-accent"
              />
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="font-medium text-sm truncate wz-strong">{{ doc.title }}</h3>
              <p class="text-xs wz-faint">{{ doc._count?.chunks || 0 }} {{ t('chat.chunks') }}</p>
            </div>
            <span class="wz-faint">→</span>
          </button>
        </div>
        <div v-else class="text-center py-6 text-sm wz-muted">
          <p>{{ t('chat.noDocs') }}</p>
          <NuxtLink to="/upload" class="wz-btn-primary text-xs mt-2 inline-block">
            {{ t('chat.uploadCta') }} ▶
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SearchResult } from '~/stores/documents'
import { useUserId } from '~/composables/useUserId'

interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
  sources?: { title: string; id: string }[]
  usedKb?: boolean | null
  results?: SearchResult[]
  expanded?: boolean
}

const { t } = useI18n()
const store = useDocumentsStore()
const { userId } = useUserId()
const input = ref('')
const chatMessages = ref<ChatTurn[]>([])
const sending = ref(false)
const scrollRef = ref<HTMLElement | null>(null)

const SESSION_KEY = 'rag-ui:chatMessages:v1'

const commandHelp = [
  {
    name: '/remember',
    description:
      'guardar un dato en tu memoria local. Ej: /remember mi color favorito es naranja',
  },
  {
    name: '/forget',
    description:
      'borrar memorias que contengan un texto. Ej: /forget color favorito',
  },
  {
    name: '/memory clear',
    description: 'limpiar toda tu memoria local.',
  },
  {
    name: '/help',
    description: 'mostrar ayuda sobre comandos disponibles.',
  },
]

const showCommandHelp = computed(() => input.value.trim().startsWith('/'))
const filteredCommands = computed(() => {
  const text = input.value.trim()
  if (!text.startsWith('/')) return commandHelp
  const lower = text.toLowerCase()
  return commandHelp.filter((c) => c.name.toLowerCase().startsWith(lower))
})

function loadChatFromSession() {
  if (typeof window === 'undefined') return
  const raw = window.sessionStorage.getItem(SESSION_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return

    // Best-effort validation so old/partial data doesn't break the UI.
    chatMessages.value = parsed.filter((t: any) => {
      return (
        t &&
        (t.role === 'user' || t.role === 'assistant') &&
        typeof t.content === 'string'
      )
    }) as ChatTurn[]
  } catch {
    // Ignore invalid JSON / corrupted session storage.
  }
}

onMounted(() => {
  loadChatFromSession()
  store.fetchDocuments()
  nextTick(scrollToBottom)
})

function scrollToBottom() {
  nextTick(() => {
    const el = scrollRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

watch(
  chatMessages,
  (val) => {
    if (typeof window === 'undefined') return
    if (!val.length) {
      window.sessionStorage.removeItem(SESSION_KEY)
      return
    }
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(val))
    scrollToBottom()
  },
  { deep: true },
)

async function send() {
  const text = input.value.trim()
  if (!text || sending.value) return

  input.value = ''
  chatMessages.value.push({ role: 'user', content: text })
  scrollToBottom()
  sending.value = true

  try {
    const payload = chatMessages.value.map(({ role, content }) => ({
      role,
      content,
    }))
    const res = await store.agentChat(payload, 8, userId.value)
    chatMessages.value.push({
      role: 'assistant',
      content: res.reply,
      sources: res.sources,
      usedKb: res.used_kb,
      results: res.results,
      expanded: false,
    })
  } catch (e: unknown) {
    const err = e as {
      data?: { message?: string | string[] }
      message?: string
      statusMessage?: string
    }
    const apiUrl = useRuntimeConfig().public.apiBaseUrl
    const fromBackend =
      (typeof err?.data?.message === 'string' ? err.data.message : null) ||
      (Array.isArray(err?.data?.message) ? err.data.message.join(', ') : null) ||
      err?.message ||
      err?.statusMessage
    const reach = t('chat.errorReach', { url: apiUrl })
    const hint = t('chat.errorHint')
    chatMessages.value.push({
      role: 'assistant',
      content: fromBackend ? `${fromBackend}\n\n${hint}` : `${reach}\n\n${hint}`,
    })
  } finally {
    sending.value = false
    scrollToBottom()
  }
}

function clearChat() {
  chatMessages.value = []
}

function getIconForType(type: string) {
  const icons: Record<string, string> = {
    text: 'i-heroicons-document-text',
    markdown: 'i-heroicons-document',
    pdf: 'i-heroicons-document-arrow-down',
    web: 'i-heroicons-globe-alt',
  }
  return icons[type] || 'i-heroicons-document'
}
</script>
