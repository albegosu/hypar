<template>
  <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-primary-500" />
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">PKM RAG</h1>
      </div>
      
      <UButton
        icon="i-heroicons-plus"
        color="primary"
        size="sm"
        @click="navigateTo('/upload')"
      >
        Add
      </UButton>
    </div>
  </header>
</template>
