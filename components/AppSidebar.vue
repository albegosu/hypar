<template>
  <aside class="hypar-sidebar" aria-label="Primary">
    <NuxtLink
      to="/"
      class="hypar-sidebar__brand"
      title="hypar"
    >
      <BrandHyparMark />
    </NuxtLink>

    <NuxtLink
      v-if="isAuthenticated && isAdmin"
      to="/admin"
      class="hypar-sidebar__item"
      :class="{ 'is-active': isActive('/admin') }"
      :aria-current="isActive('/admin') ? 'page' : undefined"
      :title="t('nav.admin')"
    >
      <UIcon name="i-heroicons-adjustments-horizontal" class="w-[18px] h-[18px]" />
    </NuxtLink>

    <div class="hypar-sidebar__spacer" />

    <NuxtLink
      v-if="docsSiteUrl"
      :to="docsSiteUrl"
      external
      target="_blank"
      rel="noopener noreferrer"
      class="hypar-sidebar__item"
      :title="t('nav.docsSiteTitle')"
    >
      <MicroGlyph name="tutorial" decorative class="w-[18px] h-[18px]" />
    </NuxtLink>

    <button
      type="button"
      class="hypar-sidebar__item"
      :class="{ 'is-dim': locale !== 'en' }"
      aria-label="Switch language"
      @click="setLocale(locale === 'en' ? 'es' : 'en')"
    >
      <span class="text-[10px] font-medium">{{ locale.toUpperCase() }}</span>
    </button>

    <button
      type="button"
      class="hypar-sidebar__item"
      aria-label="Toggle theme"
      @click="toggleTheme"
    >
      <span class="text-[13px] leading-none">{{ theme === 'light' ? '☀' : '☾' }}</span>
    </button>

    <template v-if="isAuthenticated">
      <button
        v-if="!confirmLogout"
        type="button"
        class="hypar-sidebar__item"
        aria-label="Sign out"
        @click="confirmLogout = true"
      >
        <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-[18px] h-[18px]" />
      </button>
      <div v-else class="hypar-sidebar__confirm">
        <button
          type="button"
          class="hypar-sidebar__item is-active"
          :disabled="loggingOut"
          title="Confirm sign out"
          @click="logout"
        >
          <span class="text-[10px] font-medium">{{ loggingOut ? '…' : 'Yes' }}</span>
        </button>
        <button
          type="button"
          class="hypar-sidebar__item"
          title="Cancel"
          @click="confirmLogout = false"
        >
          <span class="text-[10px] font-medium">No</span>
        </button>
      </div>
    </template>
  </aside>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MicroGlyph from '~/components/micro/MicroGlyph.vue'
import { signOut } from '~/utils/auth-client'

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })
const { theme, locale, toggleTheme, setLocale } = useTerminalPrefs()
const { isAuthenticated, isAdmin } = useAuth()

const confirmLogout = ref(false)
const loggingOut = ref(false)

const docsSiteUrl = computed(() => {
  const u = useRuntimeConfig().public.docsSiteUrl
  return typeof u === 'string' && u.trim() ? u.trim() : ''
})

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

async function logout() {
  loggingOut.value = true
  await signOut()
  clearNuxtData('auth-session')
  window.location.href = '/auth/signin'
}
</script>
