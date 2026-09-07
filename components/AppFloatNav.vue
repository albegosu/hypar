<template>
  <nav class="hypar-float-nav" aria-label="Section">
    <div
      class="hypar-dock hypar-float-nav__pill flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-[var(--term-accent-line)] shadow-lg"
      role="tablist"
    >
      <NuxtLink
        to="/"
        class="flex flex-col items-center gap-1 py-2 px-3.5 rounded-full transition-colors duration-150 relative min-w-[3.25rem]"
        :class="
          isGarden
            ? 'nav-active-pill wz-strong'
            : 'wz-muted hover:text-[color:var(--term-text-strong)]'
        "
        :aria-current="isGarden ? 'page' : undefined"
      >
        <UIcon name="i-heroicons-sparkles" class="w-5 h-5 relative z-[1]" />
        <span class="text-[11px] font-medium relative z-[1] leading-none">{{ t('nav.garden') }}</span>
      </NuxtLink>
      <NuxtLink
        v-if="isAuthenticated"
        to="/settings"
        class="flex flex-col items-center gap-1 py-2 px-3.5 rounded-full transition-colors duration-150 relative min-w-[3.25rem]"
        :class="
          isSettings
            ? 'nav-active-pill wz-strong'
            : 'wz-muted hover:text-[color:var(--term-text-strong)]'
        "
        :aria-current="isSettings ? 'page' : undefined"
      >
        <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 relative z-[1]" />
        <span class="text-[11px] font-medium relative z-[1] leading-none">{{ t('nav.settings') }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })
const { isAuthenticated } = useAuth()

const isGarden = computed(() =>
  route.path === '/' || route.path.startsWith('/embryo/'),
)
const isSettings = computed(() =>
  route.path === '/settings' || route.path.startsWith('/settings/'),
)
</script>
