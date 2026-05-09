<template>
  <div class="wizard-terminal min-h-screen" :class="{ 'theme-light': theme === 'light' }">
    <div class="wz-scanline min-h-screen">
      <header class="border-b wz-header">
        <div class="container mx-auto px-6 py-3 flex items-center justify-between text-xs">
          <div class="flex items-center gap-4">
            <span style="color: var(--wz-accent)">●</span>
            <span class="wz-muted">rag-system</span>
            <span class="wz-faint">~/wizard/home</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1" style="color: var(--wz-accent-strong)">
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
            </div>
            <button
              type="button"
              class="wz-btn-ghost wz-theme-toggle text-xs"
              @click="toggleTheme"
            >
              {{ theme === 'light' ? '[ light ]' : '[ dark ]' }}
            </button>
          </div>
        </div>
      </header>

      <main class="container mx-auto px-6 py-10 max-w-6xl">
        <!-- Welcome / CTAs -->
        <section class="wz-panel mb-8">
          <div class="wz-panel-header flex items-center gap-2">
            <span style="color: var(--wz-accent)">$</span>
            <span class="wz-label">{{ t('home.header') }}</span>
          </div>
          <div class="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl sm:text-3xl font-bold flex items-center gap-2 flex-wrap" style="color: var(--wz-text-strong)">
                <span class="inline-flex shrink-0 opacity-70 items-center" style="color: var(--wz-accent-strong)">
                  <MicroGlyph name="sparkle" decorative class="w-7! h-7!" />
                </span>
                <span>{{ t('home.title') }}</span>
              </h1>
              <p class="wz-muted text-sm mt-2 max-w-2xl">
                {{ t('home.subtitle') }}
              </p>
              <div class="flex flex-wrap gap-3 mt-5 items-center">
                <NuxtLink
                  to="/learn/onboarding"
                  class="wz-btn-primary text-xs inline-flex items-center"
                >
                  {{ t('home.ctaOnboarding') }}
                </NuxtLink>
                <NuxtLink
                  to="/learn/level/1"
                  class="wz-btn-outline text-xs inline-flex items-center"
                >
                  {{ t('home.ctaChallenges') }}
                </NuxtLink>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 text-[11px] w-full md:w-auto">
              <div class="wz-panel p-2 text-center">
                <div class="wz-faint text-[10px]">{{ t('home.durationLabel') }}</div>
                <div class="wz-strong">{{ t('home.durationValue') }}</div>
              </div>
              <div class="wz-panel p-2 text-center">
                <div class="wz-faint text-[10px]">{{ t('home.stepsLabel') }}</div>
                <div class="wz-strong">{{ t('home.stepsValue') }}</div>
              </div>
              <div class="wz-panel p-2 text-center">
                <div class="wz-faint text-[10px]">{{ t('home.configLabel') }}</div>
                <div class="wz-strong">{{ t('home.configValue') }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Level map / progress -->
        <LearnLevelMap />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'learn' })
import { useI18n } from 'vue-i18n'

const theme = ref<'dark' | 'light'>('dark');
const { t, locale } = useI18n();

onMounted(() => {
  const savedTheme = localStorage.getItem('rag-wizard-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    theme.value = savedTheme;
  } else {
    theme.value = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  const savedLocale = localStorage.getItem('rag-wizard-locale');
  const browserLocale = navigator.language.toLowerCase().startsWith('es')
    ? 'es'
    : 'en';
  locale.value = savedLocale === 'es' || savedLocale === 'en' ? savedLocale : browserLocale;
});

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  localStorage.setItem('rag-wizard-theme', theme.value);
}

function setLocale(value: 'en' | 'es') {
  locale.value = value;
  localStorage.setItem('rag-wizard-locale', value);
}
</script>

<style scoped>
.wz-header {
  border-color: var(--wz-accent-line);
  background: var(--wz-header-bg);
}
.wz-theme-toggle {
  border: 1px solid var(--wz-accent-line);
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
  background: var(--wz-accent-soft);
}
</style>
