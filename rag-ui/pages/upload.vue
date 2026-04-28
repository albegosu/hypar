<template>
  <div class="max-w-2xl mx-auto px-4 py-6">
    <div class="mb-6">
      <UButton variant="ghost" icon="i-heroicons-arrow-left" @click="$router.back()">
        Back
      </UButton>
    </div>

    <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
      Add Document
    </h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
      Paste text or upload a file. We'll chunk and embed it for retrieval.
    </p>

    <!-- Tabs -->
    <UTabs v-model="activeTab" :items="tabs" class="mb-6" />

    <!-- Text Input -->
    <div v-if="activeTab === 0" class="space-y-4">
      <UFormGroup label="Title" required>
        <UInput v-model="form.title" placeholder="Enter document title" />
      </UFormGroup>

      <UFormGroup label="Content" required>
        <UTextarea
          v-model="form.content"
          placeholder="Paste your text or notes here..."
          :rows="12"
        />
      </UFormGroup>

      <UFormGroup label="Type">
        <USelect
          v-model="form.sourceType"
          :options="[
            { label: 'Text', value: 'text' },
            { label: 'Markdown', value: 'markdown' },
          ]"
        />
      </UFormGroup>

      <UButton
        color="primary"
        size="lg"
        block
        :loading="uploading"
        :disabled="!form.title || !form.content"
        @click="submitText"
      >
        Save Document
      </UButton>
    </div>

    <!-- File Upload -->
    <div v-else class="space-y-4">
      <div
        class="rounded-xl border-2 border-dashed border-slate-300 dark:border-white/10 bg-white/50 dark:bg-slate-900/40 hover:border-violet-400 dark:hover:border-violet-500/50 transition-colors cursor-pointer"
        @click="$refs.fileInput.click()"
      >
        <div class="text-center py-10 px-6">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20 mb-4">
            <UIcon name="i-heroicons-cloud-arrow-up" class="w-6 h-6 text-violet-600 dark:text-violet-300" />
          </div>

          <p class="text-slate-700 dark:text-slate-200 font-medium mb-1">
            Drag and drop files here, or click to browse
          </p>

          <p class="text-sm text-slate-500 dark:text-slate-400">
            Supports: .txt, .md, .pdf
          </p>

          <input
            ref="fileInput"
            type="file"
            accept=".txt,.md,.pdf"
            class="hidden"
            @change="handleFileChange"
          >

          <UButton
            variant="outline"
            color="primary"
            class="mt-4"
            @click.stop="$refs.fileInput.click()"
          >
            Select File
          </UButton>
        </div>
      </div>

      <div v-if="selectedFile" class="flex items-center gap-3 p-3 bg-white dark:bg-slate-900/60 ring-1 ring-slate-200 dark:ring-white/10 rounded-xl">
        <div class="w-10 h-10 shrink-0 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/15 flex items-center justify-center">
          <UIcon name="i-heroicons-document" class="w-5 h-5 text-violet-600 dark:text-violet-300" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-slate-900 dark:text-white truncate">
            {{ selectedFile.name }}
          </p>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ formatFileSize(selectedFile.size) }}
          </p>
        </div>
        <UButton
          color="red"
          variant="ghost"
          icon="i-heroicons-x-mark"
          @click="selectedFile = null"
        />
      </div>

      <UButton
        v-if="selectedFile"
        color="primary"
        size="lg"
        block
        :loading="uploading"
        @click="submitFile"
      >
        Upload File
      </UButton>
    </div>
  </div>
</template>

<script setup>
const store = useDocumentsStore()
const router = useRouter()

const activeTab = ref(0)
const uploading = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)

const tabs = [
  { label: 'Text', icon: 'i-heroicons-document-text' },
  { label: 'File', icon: 'i-heroicons-document-arrow-up' },
]

const form = reactive({
  title: '',
  content: '',
  sourceType: 'text',
})

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

async function submitText() {
  uploading.value = true
  try {
    await store.createDocument({
      title: form.title,
      content: form.content,
      sourceType: form.sourceType,
    })
    router.push('/documents')
  } finally {
    uploading.value = false
  }
}

async function submitFile() {
  if (!selectedFile.value) return
  
  uploading.value = true
  try {
    await store.uploadFile(selectedFile.value)
    router.push('/documents')
  } finally {
    uploading.value = false
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
