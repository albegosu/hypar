<template>
  <header class="sticky top-0 z-50 glass hairline-b">
    <div
      class="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between text-xs"
    >
      <NuxtLink to="/" class="flex items-center gap-3">
        <span class="brand-mark">$_</span>
        <div class="flex items-center gap-2">
          <span class="wz-strong font-semibold">{{ t('app.brand') }}</span>
          <span class="wz-faint hidden sm:inline">~/{{ section }}</span>
        </div>
      </NuxtLink>

      <div class="flex items-center gap-1">
        <button
          type="button"
          class="wz-btn-ghost text-[10px]"
          :class="{ 'opacity-50': locale !== 'en' }"
          @click="setLocale('en')"
        >
          EN
        </button>
        <span class="wz-faint">/</span>
        <button
          type="button"
          class="wz-btn-ghost text-[10px]"
          :class="{ 'opacity-50': locale !== 'es' }"
          @click="setLocale('es')"
        >
          ES
        </button>

        <button
          type="button"
          class="wz-btn-ghost wz-theme-toggle ml-2"
          @click="toggleTheme"
        >
          {{ theme === 'light' ? '[ light ]' : '[ dark ]' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
const { theme, locale, toggleTheme, setLocale } = useTerminalPrefs()
const route = useRoute()

const section = computed(() => {
  const path = route.path
  if (path === '/') return 'chat'
  if (path.startsWith('/documents')) return path.replace(/^\//, '')
  if (path.startsWith('/upload')) return 'upload'
  return path.replace(/^\//, '')
})
</script>
