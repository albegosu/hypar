<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
    <div class="max-w-2xl mx-auto px-4">
      <div class="flex justify-around py-2">
        <NuxtLink
          v-for="item in items"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors"
          :class="$route.path === item.path ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'"
        >
          <UIcon :name="item.icon" class="w-6 h-6" />
          <span class="text-xs">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
const items = [
  { path: '/', icon: 'i-heroicons-chat-bubble-left-right', label: 'Chat' },
  { path: '/documents', icon: 'i-heroicons-document-text', label: 'Docs' },
  { path: '/upload', icon: 'i-heroicons-arrow-up-tray', label: 'Upload' },
]
</script>
