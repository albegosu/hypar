<template>
  <div
    class="terminal-theme min-h-screen"
    :class="{ 'theme-light': theme === 'light' }"
  >
    <div class="wz-scanline app-backdrop min-h-screen">
      <AppHeader />
      <main class="pb-24">
        <slot />
      </main>
      <BottomNav />
    </div>
  </div>
</template>

<script setup lang="ts">
const { theme } = useTerminalPrefs()
</script>
