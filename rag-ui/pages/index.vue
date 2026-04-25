<template>
  <div class="max-w-2xl mx-auto px-4 py-4 flex flex-col min-h-[calc(100dvh-5.5rem)]">
    <div class="text-center mb-4 shrink-0">
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">
        Chat with your knowledge base
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Lightweight agent: chooses whether to search your documents (RAG) or reply without the vector store.
      </p>
    </div>

    <div
      ref="scrollRef"
      class="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[12rem]"
    >
      <div
        v-if="!chatMessages.length"
        class="text-center text-gray-500 dark:text-gray-400 py-8 text-sm"
      >
        Ask something about the documents you uploaded. Follow-up questions keep context.
      </div>

      <div
        v-for="(msg, idx) in chatMessages"
        :key="idx"
        class="flex"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[90%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap"
          :class="
            msg.role === 'user'
              ? 'bg-primary-500 text-white rounded-br-md'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
          "
        >
          <div
            v-if="msg.role === 'assistant' && msg.usedKb != null"
            class="mb-1 flex flex-wrap gap-1"
          >
            <UBadge
              v-if="msg.usedKb"
              size="xs"
              color="primary"
              variant="subtle"
            >
              KB search
            </UBadge>
            <UBadge
              v-else
              size="xs"
              color="neutral"
              variant="subtle"
            >
              No KB
            </UBadge>
          </div>
          {{ msg.content }}
          <div
            v-if="msg.role === 'assistant' && msg.sources?.length"
            class="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300"
          >
            Sources:
            <span
              v-for="(s, i) in msg.sources"
              :key="s.id"
              class="inline"
            >
              <NuxtLink
                :to="`/documents/${s.id}`"
                class="text-primary-600 dark:text-primary-400 underline"
              >{{ s.title }}</NuxtLink>{{ i < msg.sources.length - 1 ? ', ' : '' }}
            </span>
          </div>
          <div
            v-if="msg.role === 'assistant' && msg.results?.length"
            class="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600"
          >
            <button
              type="button"
              class="text-xs text-gray-600 dark:text-gray-300 underline"
              @click="msg.expanded = !msg.expanded"
            >
              {{ msg.expanded ? 'Hide' : 'Show' }} retrieval ({{ msg.results.length }} chunks)
            </button>
            <div v-if="msg.expanded" class="mt-2 space-y-1.5">
              <div
                v-for="(r, i) in msg.results"
                :key="r.chunkId"
                class="text-xs bg-white/60 dark:bg-gray-900/40 rounded-md p-2 border border-gray-300/60 dark:border-gray-600/60"
              >
                <div class="flex items-center justify-between text-[10px] text-gray-500 mb-1 font-mono">
                  <span>#{{ i + 1 }} · {{ r.documentTitle }}</span>
                  <span>score {{ r.score.toFixed(3) }}</span>
                </div>
                <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-200 line-clamp-3">
                  {{ r.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="sending" class="flex justify-start">
        <div class="bg-gray-200 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-2 text-sm text-gray-500">
          Thinking…
        </div>
      </div>
    </div>

    <div class="shrink-0 space-y-2">
      <div class="flex gap-2">
        <UInput
          v-model="input"
          placeholder="Message…"
          size="lg"
          class="flex-1"
          :disabled="sending"
          @keyup.enter="send"
        />
        <UButton
          color="primary"
          icon="i-heroicons-paper-airplane"
          size="lg"
          :loading="sending"
          :disabled="!input.trim()"
          @click="send"
        />
      </div>
      <div class="flex justify-between items-center">
        <UButton
          v-if="chatMessages.length"
          size="xs"
          variant="ghost"
          color="gray"
          @click="clearChat"
        >
          Clear chat
        </UButton>
        <span v-else />
      </div>
    </div>

    <!-- Recent documents -->
    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 shrink-0">
      <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Recent documents
      </h2>
      <div v-if="store.loading" class="space-y-2">
        <USkeleton v-for="i in 3" :key="i" class="h-14" />
      </div>
      <div v-else-if="store.documents.length" class="space-y-2">
        <UCard
          v-for="doc in store.documents.slice(0, 5)"
          :key="doc.id"
          class="cursor-pointer hover:shadow-md transition-shadow"
          :ui="{ body: { padding: 'p-3 sm:p-3' } }"
          @click="navigateTo(`/documents/${doc.id}`)"
        >
          <div class="flex items-center gap-2 min-w-0">
            <UIcon
              :name="getIconForType(doc.sourceType)"
              class="w-4 h-4 text-gray-400 shrink-0"
            />
            <div class="min-w-0">
              <h3 class="font-medium text-sm truncate text-gray-900 dark:text-white">
                {{ doc.title }}
              </h3>
              <p class="text-xs text-gray-500">
                {{ doc._count?.chunks || 0 }} chunks
              </p>
            </div>
          </div>
        </UCard>
      </div>
      <div v-else class="text-center py-4 text-sm text-gray-500">
        <p>No documents yet.</p>
        <UButton to="/upload" size="sm" class="mt-2">Upload</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchResult } from '~/stores/documents'

interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
  sources?: { title: string; id: string }[]
  usedKb?: boolean | null
  results?: SearchResult[]
  expanded?: boolean
}

const store = useDocumentsStore()
const input = ref('')
const chatMessages = ref<ChatTurn[]>([])
const sending = ref(false)
const scrollRef = ref<HTMLElement | null>(null)

onMounted(() => {
  store.fetchDocuments()
})

function scrollToBottom() {
  nextTick(() => {
    const el = scrollRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

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
    const res = await store.agentChat(payload, 8)
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
    const hint =
      'With Docker: `docker compose up -d --build backend frontend` then hard-refresh (Cmd+Shift+R / Ctrl+Shift+R). The bottom tab should say "Chat".'
    chatMessages.value.push({
      role: 'assistant',
      content: fromBackend
        ? `${fromBackend}\n\n${hint}`
        : `Could not reach the API at ${apiUrl}. Is the backend running?\n\n${hint}`,
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
