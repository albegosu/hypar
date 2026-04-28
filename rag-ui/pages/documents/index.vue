<template>
  <div class="max-w-2xl mx-auto px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Documents
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {{ store.documents.length }} in your knowledge base
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        color="primary"
        @click="navigateTo('/upload')"
      >
        Add New
      </UButton>
    </div>

    <!-- Search -->
    <UInput
      v-model="searchTerm"
      placeholder="Search documents..."
      icon="i-heroicons-magnifying-glass"
      size="lg"
      class="mb-6"
    />

    <!-- Documents List -->
    <div v-if="store.loading" class="space-y-3">
      <USkeleton v-for="i in 5" :key="i" class="h-24" />
    </div>

    <div v-else-if="filteredDocuments.length" class="space-y-3">
      <UCard
        v-for="doc in filteredDocuments"
        :key="doc.id"
        class="card-hover cursor-pointer"
        @click="navigateTo(`/documents/${doc.id}`)"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/15">
            <UIcon
              :name="getIconForType(doc.sourceType)"
              class="w-5 h-5 text-violet-600 dark:text-violet-300"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-slate-900 dark:text-white truncate">
              {{ doc.title }}
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {{ doc.content.slice(0, 120) }}…
            </p>
            <div class="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 ring-1 ring-slate-200 dark:ring-white/10">
                <UIcon name="i-heroicons-cube" class="w-3 h-3 text-violet-500 dark:text-violet-300" />
                {{ doc._count?.chunks || 0 }} chunks
              </span>
              <span>{{ formatDate(doc.createdAt) }}</span>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <UButton
              icon="i-heroicons-trash"
              variant="ghost"
              color="red"
              size="xs"
              :loading="deletingId === doc.id"
              @click.stop="onDelete(doc)"
            />
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20 mb-4">
        <UIcon name="i-heroicons-document" class="w-8 h-8 text-violet-500 dark:text-violet-300" />
      </div>
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-1">
        No documents yet
      </h3>
      <p class="text-slate-500 dark:text-slate-400 mb-4">
        Upload your first document to get started
      </p>
      <UButton to="/upload" color="primary" size="md">
        Upload Document
      </UButton>
    </div>
  </div>
</template>

<script setup>
const store = useDocumentsStore()
const toast = useToast()
const searchTerm = ref('')
const deletingId = ref(null)

onMounted(() => {
  store.fetchDocuments()
})

const filteredDocuments = computed(() => {
  if (!searchTerm.value) return store.documents
  const term = searchTerm.value.toLowerCase()
  return store.documents.filter(doc =>
    doc.title.toLowerCase().includes(term) ||
    doc.content.toLowerCase().includes(term)
  )
})

async function onDelete(doc) {
  if (!confirm(`Delete "${doc.title}"? Its chunks and embeddings will be removed.`)) return
  deletingId.value = doc.id
  try {
    await store.deleteDocument(doc.id)
    toast.add({ title: 'Document deleted' })
  } catch (err) {
    toast.add({ title: 'Delete failed', description: err?.message ?? '', color: 'red' })
  } finally {
    deletingId.value = null
  }
}

function getIconForType(type) {
  const icons = {
    text: 'i-heroicons-document-text',
    markdown: 'i-heroicons-document',
    pdf: 'i-heroicons-document-arrow-down',
    web: 'i-heroicons-globe-alt',
  }
  return icons[type] || 'i-heroicons-document'
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
