<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 glass hairline-t pb-safe">
    <div class="max-w-2xl mx-auto px-4">
      <div class="flex justify-around py-2">
        <NuxtLink
          v-for="item in items"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center gap-1 py-2 px-5 rounded-xl transition-colors duration-150"
          :class="[
            isActive(item.path)
              ? 'nav-active-pill text-emerald-300'
              : 'text-emerald-800/70 dark:text-emerald-200/70 hover:text-emerald-700 dark:hover:text-emerald-100',
          ]"
        >
          <UIcon :name="item.icon" class="w-5 h-5 relative" />
          <span class="text-[11px] font-medium relative">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
const route = useRoute()

const items = [
  { path: '/', icon: 'i-heroicons-chat-bubble-left-right', label: 'Chat' },
  { path: '/documents', icon: 'i-heroicons-document-text', label: 'Docs' },
  { path: '/upload', icon: 'i-heroicons-arrow-up-tray', label: 'Upload' },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path + '/')
}
</script>
