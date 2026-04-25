<template>
  <div class="max-w-2xl mx-auto px-4 py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Documents
      </h1>
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
        class="cursor-pointer hover:shadow-md transition-shadow"
        @click="navigateTo(`/documents/${doc.id}`)"
      >
        <div class="flex items-start gap-3">
          <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <UIcon
              :name="getIconForType(doc.sourceType)"
              class="w-6 h-6 text-gray-600 dark:text-gray-400"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ doc.title }}
            </h3>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">
              {{ doc.content.slice(0, 100) }}...
            </p>
            <div class="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-cube" class="w-3 h-3" />
                {{ doc._count?.chunks || 0 }} chunks
              </span>
              <span>{{ formatDate(doc.createdAt) }}</span>
            </div>
          </div>
          <UButton
            icon="i-heroicons-trash"
            variant="ghost"
            color="red"
            size="xs"
            :loading="deletingId === doc.id"
            @click.stop="onDelete(doc)"
          />
          <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-300" />
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <UIcon name="i-heroicons-document" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
        No documents yet
      </h3>
      <p class="text-gray-500 mb-4">
        Upload your first document to get started
      </p>
      <UButton to="/upload" color="primary">
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
