<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <div class="mb-4">
      <NuxtLink to="/documents" class="wz-btn-ghost text-xs">
        ← {{ t('nav.back') }}
      </NuxtLink>
    </div>

    <div v-if="loading" class="space-y-3">
      <div class="wz-panel h-10 animate-pulse" style="background: var(--term-accent-soft)" />
      <div class="wz-panel h-32 animate-pulse" style="background: var(--term-accent-soft)" />
    </div>

    <div v-else-if="!doc" class="wz-panel text-center py-12 wz-muted">
      {{ t('document.notFound') }}
    </div>

    <div v-else class="space-y-6">
      <header class="wz-panel">
        <div class="wz-panel-header flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="wz-accent">$</span>
            <span class="wz-label">cat ./{{ documentId }}</span>
          </div>
          <span class="wz-faint text-[10px]">{{ formatDate(doc.createdAt) }}</span>
        </div>
        <div class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h1 class="text-lg font-semibold wz-strong break-words">{{ doc.title }}</h1>
              <div class="mt-2 flex flex-wrap items-center gap-2 text-xs wz-muted">
                <span class="wz-pill flex items-center gap-1">
                  <UIcon :name="iconForType(doc.sourceType)" class="w-3.5 h-3.5" />
                  {{ doc.sourceType }}
                </span>
                <span class="wz-pill flex items-center gap-1">
                  <UIcon name="i-heroicons-cube" class="w-3.5 h-3.5" />
                  {{ doc.chunks?.length || 0 }} {{ t('document.chunksTitle') }}
                </span>
              </div>
            </div>
            <div class="flex gap-2 shrink-0">
              <button
                type="button"
                class="wz-btn-outline text-xs"
                :disabled="reprocessing"
                @click="onReprocess"
              >
                <UIcon name="i-heroicons-arrow-path" class="w-3.5 h-3.5" />
                {{ reprocessing ? '…' : t('document.rechunk') }}
              </button>
              <button
                type="button"
                class="wz-btn-danger text-xs"
                :disabled="deleting"
                @click="onDelete"
              >
                <UIcon name="i-heroicons-trash" class="w-3.5 h-3.5" />
                {{ deleting ? '…' : t('document.delete') }}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section>
        <h2 class="text-[10px] uppercase tracking-widest wz-label mb-3 flex items-center gap-2">
          // {{ t('document.chunksTitle') }}
          <span class="wz-faint normal-case tracking-normal">{{ t('document.chunksHint') }}</span>
        </h2>

        <div v-if="!doc.chunks?.length" class="wz-faint text-sm py-3">
          {{ t('document.noChunks') }}
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="chunk in doc.chunks"
            :key="chunk.id"
            class="wz-panel p-3"
          >
            <div class="flex items-center justify-between text-xs mb-1.5 font-mono">
              <span class="wz-accent">#{{ chunk.index }}</span>
              <span class="wz-faint">
                chars {{ chunk.startChar }}–{{ chunk.endChar }}
                · ~{{ chunk.tokenCount }} tokens
              </span>
            </div>
            <p class="text-sm wz-muted whitespace-pre-wrap leading-relaxed">{{ chunk.content }}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-[10px] uppercase tracking-widest wz-label mb-3">
          // {{ t('document.originalContent') }}
        </h2>
        <div class="wz-panel p-3">
          <pre class="text-xs wz-muted whitespace-pre-wrap break-words font-mono max-h-96 overflow-y-auto">{{ doc.content }}</pre>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { DocumentDetail } from '~/stores/documents'

const { t } = useI18n()
const route = useRoute()
const store = useDocumentsStore()
const toast = useToast()

const doc = ref<DocumentDetail | null>(null)
const loading = ref(true)
const deleting = ref(false)
const reprocessing = ref(false)

const documentId = computed(() => String(route.params.id))

async function load() {
  loading.value = true
  try {
    doc.value = await store.fetchDocument(documentId.value)
  } catch {
    doc.value = null
  } finally {
    loading.value = false
  }
}

onMounted(load)

async function onDelete() {
  if (!doc.value) return
  if (!confirm(t('documents.confirmDelete', { title: doc.value.title }))) return
  deleting.value = true
  try {
    await store.deleteDocument(documentId.value)
    toast.add({ title: t('documents.deleted') })
    await navigateTo('/documents')
  } catch (err: any) {
    toast.add({ title: t('documents.deleteFailed'), description: err?.message ?? '', color: 'red' })
  } finally {
    deleting.value = false
  }
}

async function onReprocess() {
  reprocessing.value = true
  try {
    await store.reprocessDocument(documentId.value)
    toast.add({ title: t('document.rechunkOk') })
    await load()
  } catch (err: any) {
    toast.add({ title: t('document.rechunkFailed'), description: err?.message ?? '', color: 'red' })
  } finally {
    reprocessing.value = false
  }
}

function iconForType(type: string) {
  const icons: Record<string, string> = {
    text: 'i-heroicons-document-text',
    markdown: 'i-heroicons-document',
    pdf: 'i-heroicons-document-arrow-down',
    web: 'i-heroicons-globe-alt',
  }
  return icons[type] || 'i-heroicons-document'
}

function formatDate(date: string) {
  return new Date(date).toLocaleString()
}
</script>
