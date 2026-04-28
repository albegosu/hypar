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
          <button type="button" class="wz-btn-ghost wz-theme-toggle text-xs" @click="toggleTheme">
            {{ theme === 'light' ? '[ ☀ ]' : '[ ☾ ]' }}
          </button>
        </div>
      </header>

      <main class="container mx-auto px-6 py-12 max-w-4xl">
        <section class="wz-panel mb-6">
          <div class="wz-panel-header">▾ welcome</div>
          <div class="p-8 text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl wz-panel">
              <UIcon name="i-heroicons-cube" class="w-10 h-10" style="color: var(--wz-accent-strong)" />
            </div>
            <h1 class="text-4xl font-bold mb-3" style="color: var(--wz-text-strong)">Build Your RAG System</h1>
            <p class="wz-muted mb-8">Learn by doing with the same terminal-style guided wizard.</p>

            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <NuxtLink to="/onboarding" class="wz-btn-primary inline-flex items-center justify-center gap-2">
                Start Building ▶
              </NuxtLink>
              <NuxtLink to="/level/1" class="wz-btn-ghost inline-flex items-center justify-center gap-2 border rounded px-4 py-2" style="border-color: var(--wz-accent-line)">
                View Challenges →
              </NuxtLink>
            </div>
          </div>
        </section>

        <section class="grid md:grid-cols-3 gap-3 text-xs">
          <div class="wz-panel p-3"><span class="wz-muted">~30 min</span></div>
          <div class="wz-panel p-3"><span class="wz-muted">6 guided steps</span></div>
          <div class="wz-panel p-3"><span class="wz-muted">100% local config</span></div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const theme = ref<'dark' | 'light'>('dark');

onMounted(() => {
  const savedTheme = localStorage.getItem('rag-wizard-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    theme.value = savedTheme;
  } else {
    theme.value = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
});

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  localStorage.setItem('rag-wizard-theme', theme.value);
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
