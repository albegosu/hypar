<template>
  <nav class="hypar-float-nav" aria-label="Section">
    <div
      class="hypar-dock hypar-float-nav__pill flex items-center gap-0.5 p-0.5 rounded-[10px] border border-[var(--term-accent-line)]"
      role="tablist"
    >
      <NuxtLink
        to="/"
        class="hypar-float-nav__item flex items-center gap-1.5 h-7 px-2.5 rounded-[6px] transition-colors duration-150 relative"
        :class="
          isGarden
            ? 'nav-active-pill wz-strong'
            : 'wz-muted hover:text-[color:var(--term-text-strong)]'
        "
        :aria-current="isGarden ? 'page' : undefined"
      >
        <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5 relative z-[1]" />
        <span class="text-[11px] font-medium relative z-[1] leading-none max-sm:sr-only">{{ t('nav.garden') }}</span>
      </NuxtLink>
      <NuxtLink
        v-if="isAuthenticated"
        to="/settings"
        class="hypar-float-nav__item flex items-center gap-1.5 h-7 px-2.5 rounded-[6px] transition-colors duration-150 relative"
        :class="
          isSettings
            ? 'nav-active-pill wz-strong'
            : 'wz-muted hover:text-[color:var(--term-text-strong)]'
        "
        :aria-current="isSettings ? 'page' : undefined"
      >
        <UIcon name="i-heroicons-cog-6-tooth" class="w-3.5 h-3.5 relative z-[1]" />
        <span class="text-[11px] font-medium relative z-[1] leading-none max-sm:sr-only">{{ t('nav.settings') }}</span>
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
