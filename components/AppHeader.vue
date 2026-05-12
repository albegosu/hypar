<template>
  <header class="sticky top-0 z-50 glass hairline-b">
    <div class="px-4 h-12 flex items-center justify-between text-xs">

      <NuxtLink to="/" class="flex items-center gap-3 shrink-0">
        <span class="brand-mark">$_</span>
        <div class="flex items-center gap-2">
          <span class="wz-strong font-semibold">{{ t('app.brand') }}</span>
          <span class="wz-faint hidden sm:inline">~/{{ section }}</span>
        </div>
      </NuxtLink>

      <div class="flex items-center gap-1 min-w-0">
        <!-- user chip -->
        <div v-if="user" class="hidden sm:flex items-center gap-1.5 mr-2 min-w-0">
          <span class="wz-faint shrink-0">@</span>
          <span class="wz-muted truncate max-w-[120px]">{{ userLabel }}</span>
        </div>

        <NuxtLink
          v-if="user"
          to="/admin"
          class="wz-btn-ghost text-[10px] shrink-0"
        >
          [ dashboard ]
        </NuxtLink>

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
          class="wz-btn-ghost wz-theme-toggle ml-1 shrink-0"
          @click="toggleTheme"
        >
          {{ theme === 'light' ? '[ light ]' : '[ dark ]' }}
        </button>

        <template v-if="user">
          <button
            v-if="!confirmLogout"
            type="button"
            class="wz-btn-ghost text-[10px] ml-1 shrink-0"
            @click="confirmLogout = true"
          >
            [ logout ]
          </button>
          <div v-else class="flex items-center gap-1 ml-1 shrink-0">
            <span class="wz-faint text-[10px]">sure?</span>
            <button type="button" class="wz-btn-ghost text-[10px]" :disabled="loggingOut" @click="logout">
              {{ loggingOut ? '…' : 'yes' }}
            </button>
            <button type="button" class="wz-btn-ghost text-[10px]" @click="confirmLogout = false">
              no
            </button>
          </div>
        </template>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { signOut } from '~/utils/auth-client'

const { t } = useI18n({ useScope: 'global' })
const { theme, locale, toggleTheme, setLocale } = useTerminalPrefs()
const { user } = useAuth()
const route = useRoute()

const loggingOut = ref(false)
const confirmLogout = ref(false)

const userLabel = computed(() => {
  if (!user.value) return ''
  return user.value.name || user.value.email?.split('@')[0] || 'user'
})

const section = computed(() => {
  const path = route.path
  if (path === '/') return 'chat'
  if (path.startsWith('/documents')) return path.replace(/^\//, '')
  if (path.startsWith('/upload')) return 'upload'
  return path.replace(/^\//, '')
})

async function logout() {
  loggingOut.value = true
  await signOut()
  clearNuxtData('auth-session')
  window.location.href = '/auth/signin'
}
</script>
