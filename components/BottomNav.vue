<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 glass hairline-t pb-safe">
    <div class="max-w-3xl mx-auto px-4">
      <div class="flex justify-around py-2">
        <NuxtLink
          v-for="item in items"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors duration-150 relative"
          :class="[
            isActive(item.path) ? 'nav-active-pill wz-strong' : 'wz-muted hover:text-[color:var(--term-text-strong)]'
          ]"
        >
          <UIcon :name="item.icon" class="w-5 h-5 relative" />
          <span class="text-[11px] font-medium relative">{{ t(item.label) }}</span>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()

const items = [
  { path: '/', icon: 'i-heroicons-chat-bubble-left-right', label: 'nav.chat' },
  { path: '/documents', icon: 'i-heroicons-document-text', label: 'nav.documents' },
  { path: '/upload', icon: 'i-heroicons-arrow-up-tray', label: 'nav.upload' },
  { path: '/learn', icon: 'i-heroicons-academic-cap', label: 'nav.learn' },
  { path: '/settings', icon: 'i-heroicons-cog-6-tooth', label: 'nav.settings' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path + '/')
}
</script>
