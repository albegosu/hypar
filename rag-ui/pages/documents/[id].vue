<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <div class="mb-4">
      <UButton
        variant="ghost"
        color="gray"
        icon="i-heroicons-arrow-left"
        size="sm"
        @click="navigateTo('/documents')"
      >
        Documents
      </UButton>
    </div>

    <div v-if="loading" class="space-y-3">
      <USkeleton class="h-8 w-2/3" />
      <USkeleton class="h-4 w-1/3" />
      <USkeleton class="h-32" />
    </div>

    <div v-else-if="!doc" class="text-center py-12 text-gray-500">
      Document not found.
    </div>

    <div v-else class="space-y-6">
      <header>
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white break-words">
              {{ doc.title }}
            </h1>
            <div class="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <UIcon :name="iconForType(doc.sourceType)" class="w-4 h-4" />
                {{ doc.sourceType }}
              </span>
              <span>{{ doc.chunks?.length || 0 }} chunks</span>
              <span>{{ formatDate(doc.createdAt) }}</span>
            </div>
          </div>
          <div class="flex gap-2 shrink-0">
            <UButton
              icon="i-heroicons-arrow-path"
              variant="soft"
              color="primary"
              size="sm"
              :loading="reprocessing"
              @click="onReprocess"
            >
              Re-chunk
            </UButton>
            <UButton
              icon="i-heroicons-trash"
              variant="soft"
              color="red"
              size="sm"
              :loading="deleting"
              @click="onDelete"
            >
              Delete
            </UButton>
          </div>
        </div>
      </header>

      <section>
        <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <UIcon name="i-heroicons-cube" class="w-4 h-4" />
          Chunks
          <span class="text-xs font-normal text-gray-500">
            (the pieces that get embedded and searched)
          </span>
        </h2>

        <div v-if="!doc.chunks?.length" class="text-sm text-gray-500 py-4">
          No chunks yet.
        </div>

        <div v-else class="space-y-2">
          <UCard
            v-for="chunk in doc.chunks"
            :key="chunk.id"
            :ui="{ body: { padding: 'p-3 sm:p-3' } }"
          >
            <div class="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span class="font-mono">#{{ chunk.index }}</span>
              <span class="font-mono">
                chars {{ chunk.startChar }}–{{ chunk.endChar }}
                · ~{{ chunk.tokenCount }} tokens
              </span>
            </div>
            <p class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {{ chunk.content }}
            </p>
          </UCard>
        </div>
      </section>

      <section>
        <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
          Original content
        </h2>
        <UCard :ui="{ body: { padding: 'p-3 sm:p-4' } }">
          <pre class="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words font-mono max-h-96 overflow-y-auto">{{ doc.content }}</pre>
        </UCard>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DocumentDetail } from '~/stores/documents'

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
  if (!confirm(`Delete "${doc.value.title}"? Its chunks and embeddings will be removed.`)) return
  deleting.value = true
  try {
    await store.deleteDocument(documentId.value)
    toast.add({ title: 'Document deleted' })
    await navigateTo('/documents')
  } catch (err: any) {
    toast.add({ title: 'Delete failed', description: err?.message ?? '', color: 'red' })
  } finally {
    deleting.value = false
  }
}

async function onReprocess() {
  reprocessing.value = true
  try {
    await store.reprocessDocument(documentId.value)
    toast.add({ title: 'Re-chunked and re-embedded' })
    await load()
  } catch (err: any) {
    toast.add({ title: 'Reprocess failed', description: err?.message ?? '', color: 'red' })
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
