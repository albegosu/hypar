<template>
  <WelcomeModal />
  <div
    class="max-w-5xl mx-auto px-4 pt-4 lg:pt-6 flex flex-col h-[calc(100dvh-3rem-6rem)] max-h-[calc(100dvh-3rem-6rem)] overflow-hidden min-h-0"
  >
    <!-- Header panel -->
    <section class="wz-panel mb-4 lg:mb-5 shrink-0">
      <div class="wz-panel-header flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="wz-accent">$</span>
          <span class="wz-label">chat --mode={{ selectedSearchMode }} --stream</span>
        </div>
        <span class="wz-faint text-[10px]">{{ store.documents.length }} docs · ctx</span>
      </div>
      <div class="p-4">
        <h1 class="text-lg font-semibold wz-strong">// {{ t('chat.title') }}</h1>
        <p class="wz-muted text-xs mt-1">{{ t('chat.subtitle') }}</p>
      </div>
    </section>

    <div class="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 lg:gap-6">
      <div class="flex-[3] min-w-0 min-h-0 flex flex-col lg:flex-1 basis-0">
        <!-- Messages -->
        <div
          ref="scrollRef"
          class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain space-y-3 pb-6 scroll-pb-4"
        >
          <div v-if="!displayMessages.length" class="wz-panel p-6 text-center text-sm">
            <div class="text-2xl mb-2">▌</div>
            <p class="wz-muted">{{ t('chat.empty') }}</p>
          </div>

          <div
            v-for="(msg, idx) in displayMessages"
            :key="msg.id"
            class="flex min-w-0"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[90%] min-w-0 rounded-md px-3 py-2 text-sm whitespace-pre-wrap break-words leading-relaxed"
              :class="msg.role === 'user' ? 'bubble-user' : 'bubble-assistant'"
            >
              <div
                v-if="msg.role === 'user'"
                class="wz-faint text-[10px] mb-1 font-mono space-y-0.5"
              >
                <div>&gt; user</div>
                <div v-if="msg.userMetrics" class="flex flex-wrap gap-x-2 gap-y-0.5">
                  <span>{{ t('chat.userMetricsMode', { mode: msg.userMetrics.searchMode }) }}</span>
                  <span>{{ t('chat.userMetricsDocs', { count: msg.userMetrics.docsCount }) }}</span>
                  <span>{{ t('chat.userMetricsChars', { count: msg.userMetrics.charCount }) }}</span>
                </div>
                <div
                  v-if="msg.userMetrics?.inputTokens != null || msg.userMetrics?.outputTokens != null"
                  class="wz-faint"
                >
                  <span v-if="msg.userMetrics.inputTokens != null">
                    {{ t('chat.userMetricsTokensIn', { count: msg.userMetrics.inputTokens }) }}
                  </span>
                  <span v-if="msg.userMetrics.outputTokens != null">
                    <template v-if="msg.userMetrics.inputTokens != null"> · </template>
                    {{ t('chat.userMetricsTokensOut', { count: msg.userMetrics.outputTokens }) }}
                  </span>
                </div>
              </div>
              <div
                v-if="msg.role === 'assistant'"
                class="wz-faint text-[10px] mb-1 font-mono flex items-center gap-2"
              >
                <span>&lt; agent</span>
                <span v-if="msg.searched === true" class="wz-pill" :title="t('chat.searchedHint')">{{ t('chat.searched') }}</span>
                <span v-else-if="msg.searched === false" class="wz-pill wz-pill-dashed" :title="t('chat.notSearchedHint')">{{ t('chat.notSearched') }}</span>
                <span v-if="msg.cited" class="wz-pill" :title="t('chat.citedHint')">{{ t('chat.cited') }}</span>
              </div>

              <div
                v-if="msg.role === 'assistant'"
                class="markdown-body"
                v-html="msg.html"
              />
              <template v-else>{{ msg.text }}</template>

              <div
                v-if="msg.role === 'assistant' && msg.sources?.length"
                class="mt-2 pt-2 border-t text-xs"
                style="border-color: var(--term-accent-faint)"
              >
                <span class="wz-faint">{{ t('chat.sources') }}:</span>
                <span
                  v-for="(s, i) in msg.sources"
                  :key="s.chunkId"
                  class="inline"
                >
                  <NuxtLink
                    :to="`/documents/${s.documentId}`"
                    class="wz-accent hover:underline"
                  >{{ s.documentTitle }}</NuxtLink>{{ i < msg.sources.length - 1 ? ', ' : '' }}
                </span>
              </div>

              <RagPipelineTrace
                v-if="msg.role === 'assistant' && msg.sources?.length && searchParams"
                :sources="msg.sources"
                :params="searchParams"
                :latency-ms="msg.latencyMs"
              />

              <div
                v-if="msg.role === 'assistant' && msg.results?.length"
                class="mt-2 pt-2 border-t"
                style="border-color: var(--term-accent-faint)"
              >
                <button
                  type="button"
                  class="wz-btn-ghost text-[11px] inline-flex items-center gap-1"
                  @click="toggleExpand(idx)"
                >
                  <UIcon
                    name="i-heroicons-chevron-down"
                    class="w-3 h-3 transition-transform"
                    :class="expandedSet.has(idx) ? 'rotate-180' : ''"
                  />
                  {{ expandedSet.has(idx) ? t('chat.hideRetrieval') : t('chat.showRetrieval') }}
                  ({{ msg.results.length }} {{ t('chat.chunks') }})
                </button>
                <div v-if="expandedSet.has(idx)" class="mt-2 space-y-1.5">
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

          <div v-if="isWaiting" class="flex justify-start">
            <div class="bubble-assistant rounded-md px-3 py-2 text-sm flex items-center gap-2">
              <span class="inline-flex gap-1">
                <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background: var(--term-accent)" />
                <span class="w-1.5 h-1.5 rounded-full animate-pulse [animation-delay:120ms]" style="background: var(--term-accent)" />
                <span class="w-1.5 h-1.5 rounded-full animate-pulse [animation-delay:240ms]" style="background: var(--term-accent)" />
              </span>
              <span class="wz-muted">{{ isSearching ? t('chat.searching') : t('chat.thinking') }}</span>
            </div>
          </div>

          <div v-if="visibleChatError" class="flex justify-start">
            <div class="bubble-assistant rounded-md px-3 py-2 text-sm space-y-1" style="border-color: var(--term-error, #f87171);">
              <div class="flex items-center gap-2 font-mono text-[11px]" style="color: var(--term-error, #f87171);">
                <span>⚠</span>
                <span>{{ t('chat.errorTitle') }}</span>
                <button type="button" class="ml-auto wz-btn-ghost text-[10px]" @click="dismissError">✕</button>
              </div>
              <p class="wz-muted text-xs">{{ chatErrorMessage }}</p>
              <NuxtLink
                v-if="isAppRateLimitError"
                to="/settings?reason=ratelimit"
                class="inline-block text-[11px] wz-accent underline"
                @click="dismissError"
              >{{ t('chat.errorAppRateLimitCta') }} →</NuxtLink>
              <a
                v-else-if="isProviderQuotaError"
                href="https://ai.dev/rate-limit"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block text-[11px] wz-accent underline"
                @click="dismissError"
              >{{ t('chat.errorProviderQuotaCta') }} →</a>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="shrink-0 space-y-2 glass hairline-t pb-safe">
          <div class="flex items-center gap-2 wz-panel px-3 py-2">
            <span class="wz-accent text-sm select-none">&gt;</span>
            <input
              ref="chatInputRef"
              v-model="input"
              type="text"
              :placeholder="t('chat.placeholder')"
              class="wz-input flex-1 border-0 bg-transparent !p-0 focus:!shadow-none"
              :class="isBusy ? 'opacity-70 cursor-wait' : ''"
              style="background: transparent; border: 0;"
              :readonly="isBusy"
              autocomplete="off"
              @keydown="onChatInputKeydown"
              @keyup.enter="send"
            >
            <button
              v-if="isBusy"
              type="button"
              class="wz-btn-ghost text-xs"
              @click="chat.stop()"
            >
              ✕ stop
            </button>
            <button
              type="button"
              class="wz-btn-primary text-xs"
              :disabled="!input.trim() || isBusy"
              @click="send"
            >
              {{ isBusy ? '…' : `${t('chat.send')} ▶` }}
            </button>
          </div>
          <div
            v-if="showCommandHelp && filteredCommands.length"
            class="wz-panel px-3 py-2 space-y-1 text-[11px]"
          >
            <div class="wz-faint mb-1">
              {{ t('chat.commandsAvailable') }}
            </div>
            <div
              v-for="(cmd, idx) in filteredCommands"
              :key="cmd.name"
              class="flex flex-col cursor-pointer px-1 py-0.5 rounded select-none"
              :class="idx === selectedCommandIdx ? 'bg-[color:var(--term-accent-line)] text-[color:var(--term-fg)]' : 'hover:bg-[color:var(--term-accent-line)]/40'"
              @click="selectCommand(cmd)"
            >
              <span class="wz-accent font-mono">{{ cmd.name }}</span>
              <span class="wz-muted">{{ cmd.description }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <button
              v-if="displayMessages.length"
              type="button"
              class="wz-btn-ghost text-[10px]"
              @click="clearChat"
            >
              ✕ {{ t('chat.clear') }}
            </button>
            <span v-else />
            <div class="flex items-center gap-3">
            <!-- search mode selector -->
            <div class="relative">
              <button
                type="button"
                class="font-mono text-[10px] flex items-center gap-1 cursor-pointer select-none wz-faint hover:wz-accent"
                :class="selectedSearchMode !== 'auto' ? 'wz-accent' : ''"
                :title="`search mode: ${selectedSearchMode}`"
                @click.stop="searchModeMenuOpen = !searchModeMenuOpen"
              >
                <span class="opacity-50">mode/</span>
                <span>{{ selectedSearchMode }}</span>
                <span class="opacity-50">▾</span>
              </button>
              <div
                v-if="searchModeMenuOpen"
                class="absolute bottom-full right-0 mb-2 w-56 z-10 rounded border border-[color:var(--term-accent-line)] bg-[color:var(--term-bg)] shadow-xl"
                @click.stop
              >
                <div class="px-3 py-1.5 text-[9px] wz-faint uppercase tracking-widest border-b border-[color:var(--term-accent-line)]">// search mode</div>
                <button
                  v-for="m in SEARCH_MODES"
                  :key="m.value"
                  type="button"
                  class="w-full text-left px-3 py-2 flex flex-col gap-0.5"
                  :class="m.value === selectedSearchMode
                    ? 'wz-accent bg-[color:var(--term-accent-soft)]'
                    : 'hover:bg-[color:var(--term-accent-soft)]'"
                  @click="selectSearchMode(m.value)"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-[11px]">{{ m.label }}</span>
                    <span v-if="m.value === selectedSearchMode" class="text-[9px] opacity-40">✓</span>
                  </div>
                  <span class="text-[9px] wz-faint opacity-60">{{ m.description }}</span>
                </button>
              </div>
            </div>
            <!-- model selector -->
            <div v-if="llmConfig && llmConfig.models.length > 1" class="relative">
              <button
                type="button"
                class="font-mono text-[10px] flex items-center gap-1 cursor-pointer select-none wz-faint hover:wz-accent"
                :title="`${llmConfig.provider} · click to change model`"
                @click.stop="modelMenuOpen = !modelMenuOpen"
              >
                <span class="opacity-50">{{ llmConfig.provider }}/</span>
                <span>{{ selectedModel }}</span>
                <span class="opacity-50">▾</span>
              </button>
              <div
                v-if="modelMenuOpen"
                class="absolute bottom-full right-0 mb-2 w-64 z-10 rounded border border-[color:var(--term-accent-line)] bg-[color:var(--term-bg)] shadow-xl flex flex-col"
                style="max-height: 320px"
                @click.stop
              >
                <!-- header -->
                <div class="px-3 py-1.5 text-[9px] wz-faint uppercase tracking-widest border-b border-[color:var(--term-accent-line)] shrink-0 flex items-center justify-between">
                  <span>// model</span>
                  <span class="opacity-40">{{ filteredLlmModels.length }}/{{ llmConfig.models.length }}</span>
                </div>
                <!-- search -->
                <div class="px-2 py-1.5 border-b border-[color:var(--term-accent-line)] shrink-0">
                  <input
                    ref="modelSearchRef"
                    v-model="modelSearch"
                    type="text"
                    placeholder="filter..."
                    class="w-full bg-transparent font-mono text-[11px] wz-faint outline-none placeholder:opacity-30"
                    @keydown.escape.stop="modelMenuOpen = false"
                  >
                </div>
                <!-- active model pinned -->
                <div class="px-3 py-1.5 border-b border-[color:var(--term-accent-line)] shrink-0 flex items-center justify-between bg-[color:var(--term-accent-soft)]">
                  <span class="font-mono text-[11px] wz-accent truncate">{{ selectedModel }}</span>
                  <span class="text-[9px] wz-faint ml-2 shrink-0">active</span>
                </div>
                <!-- list -->
                <div class="overflow-y-auto flex-1">
                  <button
                    v-for="m in filteredLlmModels"
                    :key="m.value"
                    type="button"
                    class="w-full text-left px-3 py-1.5 text-[11px] font-mono flex items-center justify-between"
                    :class="m.value === selectedModel
                      ? 'wz-accent bg-[color:var(--term-accent-soft)]'
                      : 'wz-faint hover:wz-accent hover:bg-[color:var(--term-accent-soft)]'"
                    @click="selectModel(m.value)"
                  >
                    <span class="truncate">{{ m.value }}</span>
                    <span v-if="m.value === selectedModel" class="text-[9px] opacity-40 ml-2 shrink-0">✓</span>
                  </button>
                  <div v-if="!filteredLlmModels.length" class="px-3 py-2 text-[11px] wz-faint opacity-50">
                    no results
                  </div>
                </div>
              </div>
            </div>
            </div><!-- end flex gap-3 -->
          </div>
        </div>
      </div>

      <!-- Sidebar: conversations + recent documents (each list scrolls independently) -->
      <section
        class="mt-4 pt-4 hairline-t min-h-0 flex flex-col flex-[2] gap-4 lg:flex-none lg:flex-col lg:gap-6 lg:mt-0 lg:pt-0 lg:pl-6 lg:border-t-0 lg:w-80 w-full"
      >
        <div class="flex flex-col min-h-0 flex-1 basis-0 lg:flex-[1_1_0]">
          <div class="flex items-center justify-between mb-3 shrink-0">
            <h2 class="text-[10px] uppercase tracking-widest wz-label">
              // {{ t('chat.conversations') }}
            </h2>
            <button type="button" class="wz-btn-ghost text-[10px]" @click="newConversation">
              {{ t('chat.newConversation') }}
            </button>
          </div>
          <div
            v-if="conversations.length"
            class="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-1.5 pr-0.5"
          >
            <div
              v-for="c in conversations"
              :key="c.id"
              class="wz-panel p-2 flex items-center gap-2 cursor-pointer card-hover"
              :class="{ 'wz-pill': c.id === conversationId }"
              @click="loadConversation(c.id)"
            >
              <div class="flex-1 min-w-0">
                <div class="text-xs wz-strong truncate">{{ c.title || t('chat.untitled') }}</div>
                <div class="text-[10px] wz-faint">{{ c.messageCount }} msg</div>
              </div>
              <button
                type="button"
                class="wz-btn-ghost text-[10px]"
                :title="t('chat.deleteTitle')"
                @click.stop="deleteConversation(c.id)"
              >✕</button>
            </div>
          </div>
          <div v-else class="text-xs wz-faint shrink-0">{{ t('chat.noConversations') }}</div>
        </div>

        <div class="flex flex-col min-h-0 flex-1 basis-0 lg:flex-[1_1_0]">
          <h2 class="text-[10px] uppercase tracking-widest wz-label mb-3 shrink-0">
            // {{ t('chat.recentDocs') }}
          </h2>
          <div
            v-if="store.loading"
            class="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-2 pr-0.5"
          >
            <div
              v-for="i in 3"
              :key="i"
              class="wz-panel h-12 animate-pulse"
              style="background: var(--term-accent-soft)"
            />
          </div>
          <div
            v-else-if="store.documents.length"
            class="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-2 pr-0.5"
          >
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
          <div v-else class="text-center py-6 text-sm wz-muted shrink-0">
            <p>{{ t('chat.noDocs') }}</p>
            <NuxtLink to="/upload" class="wz-btn-primary text-xs mt-2 inline-block">
              {{ t('chat.uploadCta') }} ▶
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Chat } from '@ai-sdk/vue'
import { DefaultChatTransport, APICallError, type UIMessage } from 'ai'
import { marked } from 'marked'
import type { SearchResult, ConverseSource } from '~/stores/documents'
import { useSearchParams, type SearchParamsConfig } from '~/composables/useSearchParams'
import { fetchLlmModels, getPersistedModel, persistModel, type LlmModelsConfig } from '~/composables/useLlmModels'
import { classifyLlmError } from '~/utils/llm-errors'

interface KbToolOutput {
  context: string
  sources: ConverseSource[]
  results: SearchResult[]
  count: number
  latencyMs?: number
}

/** Persisted on reload so citations render without synthetic tool parts in the API payload. */
interface ChatMessageMetadata {
  sources?: ConverseSource[]
  usage?: {
    inputTokens?: number
    outputTokens?: number
  }
}

interface UserMsgMeta {
  searchMode: string
  docsCount: number
  charCount: number
}

const userMsgMeta = reactive(new Map<string, UserMsgMeta>())

const { t } = useI18n()
const store = useDocumentsStore()
const input = ref('')
const lastSentInput = ref('')
const scrollRef = ref<HTMLElement | null>(null)
const chatInputRef = ref<HTMLInputElement | null>(null)
const expandedSet = reactive(new Set<number>())

const SESSION_KEY = 'rag-ui:chatMessages:v2'
const CONV_ID_KEY = 'rag-ui:conversationId'

const conversationId = ref<string | null>(null)

interface ConversationSummary {
  id: string
  title: string | null
  updatedAt: string
  messageCount: number
}
const conversations = ref<ConversationSummary[]>([])

const llmConfig = ref<LlmModelsConfig | null>(null)
const selectedModel = ref('')
const modelMenuOpen = ref(false)
const modelSearch = ref('')
const modelSearchRef = ref<HTMLInputElement | null>(null)

type SearchMode = 'auto' | 'search' | 'direct'
const SEARCH_MODE_KEY = 'rag-ui:searchMode'
const selectedSearchMode = ref<SearchMode>('auto')
const searchModeMenuOpen = ref(false)

const SEARCH_MODES: { value: SearchMode; label: string; description: string }[] = [
  { value: 'auto',   label: 'auto',   description: 'agent decides when to search' },
  { value: 'search', label: 'search', description: 'always search the knowledge base' },
  { value: 'direct', label: 'direct', description: 'skip KB, answer from model' },
]

function selectSearchMode(mode: SearchMode) {
  selectedSearchMode.value = mode
  if (typeof window !== 'undefined') localStorage.setItem(SEARCH_MODE_KEY, mode)
  searchModeMenuOpen.value = false
  nextTick(() => chatInputRef.value?.focus())
}

function closeSearchModeMenu() {
  searchModeMenuOpen.value = false
}

const filteredLlmModels = computed(() => {
  if (!llmConfig.value) return []
  const q = modelSearch.value.trim().toLowerCase()
  return llmConfig.value.models.filter((m) => !q || m.value.toLowerCase().includes(q))
})

watch(modelMenuOpen, (open) => {
  if (open) {
    modelSearch.value = ''
    nextTick(() => modelSearchRef.value?.focus())
  }
})

function selectModel(model: string) {
  selectedModel.value = model
  persistModel(model)
  modelMenuOpen.value = false
  nextTick(() => chatInputRef.value?.focus())
}

function closeModelMenu() {
  modelMenuOpen.value = false
}

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    body: () => ({
      conversationId: conversationId.value || undefined,
      model: selectedModel.value || undefined,
      searchMode: selectedSearchMode.value !== 'auto' ? selectedSearchMode.value : undefined,
    }),
  }),
})

async function ensureConversationId(): Promise<string> {
  if (conversationId.value) return conversationId.value
  const { id } = await $fetch<{ id: string }>('/api/conversations', {
    method: 'POST',
    body: {},
  })
  conversationId.value = id
  if (typeof window !== 'undefined') window.sessionStorage.setItem(CONV_ID_KEY, id)
  await fetchConversations()
  return id
}

async function fetchConversations() {
  try {
    const { items } = await $fetch<{ items: ConversationSummary[] }>('/api/conversations')
    conversations.value = items
  } catch {
    /* non-fatal */
  }
}

async function loadConversation(id: string) {
  try {
    const conv = await $fetch<{
      id: string
      messages: Array<{ id: string; role: string; content: string; parts: unknown; sources: unknown }>
    }>(`/api/conversations/${id}`)
    conversationId.value = conv.id
    if (typeof window !== 'undefined') window.sessionStorage.setItem(CONV_ID_KEY, conv.id)
    chat.messages = conv.messages.map((m) => {
      const rawParts: Array<{ type: string; [key: string]: unknown }> =
        Array.isArray(m.parts) && (m.parts as unknown[]).length
          ? (m.parts as Array<{ type: string }>)
          : [{ type: 'text', text: m.content }]

      const storedSources = Array.isArray(m.sources) ? (m.sources as ConverseSource[]) : []
      const partsForApi = rawParts.filter((p) => !p.type.startsWith('tool-') && p.type !== 'dynamic-tool')

      return {
        id: m.id,
        role: m.role as 'user' | 'assistant' | 'system',
        parts: partsForApi,
        metadata: storedSources.length ? { sources: storedSources } satisfies ChatMessageMetadata : undefined,
      }
    }) as unknown as UIMessage[]
    expandedSet.clear()
    nextTick(scrollToBottom)
  } catch (err) {
    console.error('failed to load conversation', err)
  }
}

async function newConversation() {
  conversationId.value = null
  if (typeof window !== 'undefined') window.sessionStorage.removeItem(CONV_ID_KEY)
  chat.messages = []
  expandedSet.clear()
  userMsgMeta.clear()
}

async function deleteConversation(id: string) {
  await $fetch(`/api/conversations/${id}`, { method: 'DELETE' })
  if (conversationId.value === id) await newConversation()
  await fetchConversations()
}

const isBusy = computed(() => chat.status === 'submitted' || chat.status === 'streaming')
const isWaiting = computed(() => {
  if (chat.status !== 'submitted' && chat.status !== 'streaming') return false
  const last = chat.messages[chat.messages.length - 1]
  if (!last || last.role !== 'assistant') return true
  const hasText = last.parts.some((p) => p.type === 'text' && (p as { text: string }).text.length)
  return !hasText
})
const isSearching = computed(() => {
  if (!isBusy.value) return false
  const last = chat.messages[chat.messages.length - 1]
  if (!last || last.role !== 'assistant') return false
  return last.parts.some(
    (p) =>
      p.type === 'tool-searchKnowledgeBase' &&
      'state' in p &&
      (p as { state: string }).state !== 'output-available',
  )
})

const dismissedError = ref<unknown>(null)
const visibleChatError = computed(() => chat.error && chat.error !== dismissedError.value)

const classifiedChatError = computed(() => {
  const err = chat.error
  return err ? classifyLlmError(err) : null
})

const isAppRateLimitError = computed(() => classifiedChatError.value?.kind === 'app_rate_limit')
const isProviderQuotaError = computed(() => classifiedChatError.value?.kind === 'provider_quota')

function dismissError() {
  dismissedError.value = chat.error
}

const chatErrorMessage = computed(() => {
  const classified = classifiedChatError.value
  if (!classified) return ''

  switch (classified.kind) {
    case 'app_rate_limit':
      return t('chat.errorAppRateLimit')
    case 'provider_quota':
      if (classified.retryAfterSeconds != null) {
        return t('chat.errorProviderQuota', { seconds: classified.retryAfterSeconds })
      }
      return t('chat.errorProviderQuotaNoWait')
    case 'unauthorized':
      return t('chat.errorUnauthorized')
    case 'unreachable':
      return t('chat.errorUnreachable')
    case 'model':
      if (APICallError.isInstance(chat.error)) {
        return `${t('chat.errorModel')} (${chat.error.statusCode}): ${chat.error.message}`
      }
      return classified.rawMessage || t('chat.errorGeneric')
    default:
      return classified.rawMessage || t('chat.errorGeneric')
  }
})

interface UserMessageMetrics {
  searchMode: string
  docsCount: number
  charCount: number
  inputTokens?: number
  outputTokens?: number
}

interface DisplayMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  text: string
  html: string
  sources?: ConverseSource[]
  results?: SearchResult[]
  /** True if the agent invoked the searchKnowledgeBase tool. */
  searched: boolean | null
  /** True only if the assistant text references retrieved sources. */
  cited: boolean
  latencyMs?: number
  userMetrics?: UserMessageMetrics
}

function renderMarkdown(text: string): string {
  if (!text) return ''
  const out = marked.parse(text, { async: false }) as string
  return out
}

/** Tool output used `{ id, title }`; UI expects `ConverseSource` (`documentId`, `documentTitle`). */
function normalizeToolSources(sources: ConverseSource[] | undefined): ConverseSource[] | undefined {
  if (!sources?.length) return undefined
  return sources.map((raw) => {
    const s = raw as ConverseSource & { id?: string; title?: string }
    const title = (s.documentTitle || s.title || '').trim()
    return {
      chunkId: s.chunkId ?? '',
      documentId: s.documentId ?? s.id ?? '',
      documentTitle: title || t('chat.untitled'),
      score: typeof s.score === 'number' ? s.score : 0,
    }
  })
}

function usageFromAssistantMeta(meta: ChatMessageMetadata | undefined): {
  inputTokens?: number
  outputTokens?: number
} {
  const u = meta?.usage
  if (!u) return {}
  return {
    inputTokens: u.inputTokens,
    outputTokens: u.outputTokens,
  }
}

const displayMessages = computed<DisplayMessage[]>(() => {
  const raw = chat.messages
  return raw.map((m, i) => {
    let text = ''
    let toolOutput: KbToolOutput | null = null
    let toolCalled = false
    for (const part of m.parts) {
      if (part.type === 'text') {
        text += (part as { text: string }).text
      } else if (
        (part.type === 'tool-searchKnowledgeBase' || part.type === 'dynamic-tool') &&
        'state' in part
      ) {
        toolCalled = true
        const p = part as { state: string; output?: unknown }
        if (p.state === 'output-available' && p.output) {
          toolOutput = p.output as KbToolOutput
        }
      }
    }
    const assistantNoTextButRetrieved =
      m.role === 'assistant' && !text.trim() && toolOutput != null && toolCalled
    const displayText = assistantNoTextButRetrieved ? t('chat.noModelReply') : text

    const metaSources = (m.metadata as ChatMessageMetadata | undefined)?.sources
    const sources = normalizeToolSources(toolOutput?.sources ?? metaSources)
    const hadKbSearch = toolCalled || (metaSources?.length ?? 0) > 0
    // The assistant "cited" only if its text actually contains a [n] reference
    // matching one of the returned sources. Retrieving chunks alone isn't enough.
    const cited = m.role === 'assistant'
      && !!sources?.length
      && /\[\d+\]/.test(text)

    let userMetrics: UserMessageMetrics | undefined
    if (m.role === 'user') {
      const stored = userMsgMeta.get(m.id)
      const next = raw[i + 1]
      const tokenUsage =
        next?.role === 'assistant'
          ? usageFromAssistantMeta(next.metadata as ChatMessageMetadata | undefined)
          : {}
      if (stored || tokenUsage.inputTokens != null || tokenUsage.outputTokens != null) {
        userMetrics = {
          searchMode: stored?.searchMode ?? selectedSearchMode.value,
          docsCount: stored?.docsCount ?? store.documents.length,
          charCount: stored?.charCount ?? text.length,
          ...tokenUsage,
        }
      }
    }

    return {
      id: m.id,
      role: m.role,
      text: displayText,
      html: m.role === 'assistant' ? renderMarkdown(displayText) : '',
      sources,
      results: toolOutput?.results,
      searched: m.role === 'assistant' ? (hadKbSearch ? true : (text ? false : null)) : null,
      cited,
      latencyMs: toolOutput?.latencyMs,
      userMetrics,
    }
  })
})

const commandHelp = computed(() => [
  { name: '/remember',    description: t('chat.commands.remember'),    hasArgs: true },
  { name: '/forget',      description: t('chat.commands.forget'),      hasArgs: true },
  { name: '/search',      description: t('chat.commands.search'),      hasArgs: true },
  { name: '/list',        description: t('chat.commands.list'),        hasArgs: false },
  { name: '/new',         description: t('chat.commands.new'),         hasArgs: false },
  { name: '/memory clear', description: t('chat.commands.memoryClear'), hasArgs: false },
  { name: '/help',        description: t('chat.commands.help'),        hasArgs: false },
])

const selectedCommandIdx = ref(-1)
watch(input, () => { selectedCommandIdx.value = -1 })

const showCommandHelp = computed(() => input.value.trim().startsWith('/'))
const filteredCommands = computed(() => {
  const text = input.value.trim()
  if (!text.startsWith('/')) return commandHelp.value
  const lower = text.toLowerCase()
  return commandHelp.value.filter((c) => c.name.toLowerCase().startsWith(lower))
})

function selectCommand(cmd: { name: string; hasArgs: boolean }) {
  input.value = cmd.hasArgs ? `${cmd.name} ` : cmd.name
  selectedCommandIdx.value = -1
  nextTick(() => chatInputRef.value?.focus())
}

function toggleExpand(idx: number) {
  if (expandedSet.has(idx)) expandedSet.delete(idx)
  else expandedSet.add(idx)
}

function loadChatFromSession() {
  if (typeof window === 'undefined') return
  const savedConv = window.sessionStorage.getItem(CONV_ID_KEY)
  if (savedConv) {
    loadConversation(savedConv)
    return
  }
  const raw = window.sessionStorage.getItem(SESSION_KEY)
  if (!raw) return
  try {
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) {
      chat.messages = parsed as UIMessage[]
    }
  } catch {
    /* ignore */
  }
}

const searchParams = ref<SearchParamsConfig | null>(null)

onMounted(() => {
  loadChatFromSession()
  fetchConversations()
  store.fetchDocuments()
  nextTick(scrollToBottom)
  useSearchParams().then((p) => { searchParams.value = p }).catch(() => {})
  fetchLlmModels().then((cfg) => {
    llmConfig.value = cfg
    const persisted = getPersistedModel()
    const valid = cfg.models.length === 0 || cfg.models.some((m) => m.value === persisted)
    selectedModel.value = (persisted && valid) ? persisted : cfg.defaultModel
  }).catch(() => {})
  document.addEventListener('click', closeModelMenu)
  document.addEventListener('click', closeSearchModeMenu)
  const savedMode = typeof window !== 'undefined' ? localStorage.getItem(SEARCH_MODE_KEY) : null
  if (savedMode === 'search' || savedMode === 'direct') selectedSearchMode.value = savedMode
})

onUnmounted(() => {
  document.removeEventListener('click', closeModelMenu)
  document.removeEventListener('click', closeSearchModeMenu)
})

function scrollToBottom() {
  nextTick(() => {
    const el = scrollRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

function focusChatInput() {
  nextTick(() => {
    chatInputRef.value?.focus({ preventScroll: true })
  })
}

function onChatInputKeydown(e: KeyboardEvent) {
  if (isBusy.value) {
    const k = e.key
    if (k.length === 1 || k === 'Enter' || k === 'Backspace' || k === 'Delete') {
      e.preventDefault()
    }
    return
  }
  if (showCommandHelp.value && filteredCommands.value.length) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      selectedCommandIdx.value = (selectedCommandIdx.value + 1) % filteredCommands.value.length
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      selectedCommandIdx.value = selectedCommandIdx.value <= 0
        ? filteredCommands.value.length - 1
        : selectedCommandIdx.value - 1
    } else if (e.key === 'Enter' && selectedCommandIdx.value >= 0) {
      e.preventDefault()
      selectCommand(filteredCommands.value[selectedCommandIdx.value])
    } else if (e.key === 'Escape') {
      input.value = ''
    }
  }
}

watch(
  () => chat.messages.length,
  () => {
    if (typeof window === 'undefined') return
    if (!chat.messages.length) {
      window.sessionStorage.removeItem(SESSION_KEY)
      return
    }
    scrollToBottom()
  },
)

watch(
  () => chat.messages.map((m) => m.parts.length).join(','),
  () => {
    if (typeof window === 'undefined') return
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(chat.messages))
    scrollToBottom()
  },
)

watch(
  () => chat.status,
  (newStatus, oldStatus) => {
    if (
      (oldStatus === 'submitted' || oldStatus === 'streaming') &&
      newStatus === 'ready' &&
      lastSentInput.value.startsWith('/remember')
    ) {
      store.fetchDocuments()
    }
  },
)

watch(
  () => isBusy.value,
  (busy, wasBusy) => {
    if (wasBusy === true && busy === false) focusChatInput()
  },
)

watch(
  () => chat.error,
  (err) => {
    if (err && classifyLlmError(err).kind === 'provider_quota' && typeof window !== 'undefined') {
      window.sessionStorage.setItem('rag-ui:providerQuotaAt', String(Date.now()))
    }
  },
)

async function send() {
  const text = input.value.trim()
  if (!text || isBusy.value) return
  if (text === '/new') {
    input.value = ''
    newConversation()
    return
  }
  lastSentInput.value = text
  input.value = ''
  const pendingMeta: UserMsgMeta = {
    searchMode: selectedSearchMode.value,
    docsCount: store.documents.length,
    charCount: text.length,
  }
  await ensureConversationId()
  await chat.sendMessage({ text })
  const lastUser = [...chat.messages].reverse().find((m) => m.role === 'user')
  if (lastUser) userMsgMeta.set(lastUser.id, pendingMeta)
  // Refresh sidebar so the new conversation/title appears.
  fetchConversations()
  focusChatInput()
}

function clearChat() {
  newConversation()
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(SESSION_KEY)
  }
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

<style>
.markdown-body p { margin: 0 0 0.5rem 0; }
.markdown-body p:last-child { margin-bottom: 0; }
.markdown-body code {
  background: var(--term-accent-soft);
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
}
.markdown-body pre {
  background: var(--term-accent-soft);
  padding: 0.6rem 0.8rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0.5rem 0;
}
.markdown-body pre code {
  background: transparent;
  padding: 0;
}
.markdown-body ul, .markdown-body ol {
  margin: 0.25rem 0 0.5rem 1.25rem;
}
.markdown-body a { text-decoration: underline; }
.markdown-body {
  overflow-wrap: break-word;
  word-break: break-word;
}
</style>
