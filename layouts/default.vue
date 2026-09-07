<template>
  <div
    class="terminal-theme min-h-screen"
    :class="{ 'theme-light': theme === 'light' }"
  >
    <div class="app-backdrop min-h-screen">
      <AppFluidField />
      <!-- One window: rail (left wall) + U-rim stage → full-width pane -->
      <div class="hypar-frame">
        <div class="hypar-shell__rail">
          <AppSidebar />
        </div>
        <div class="hypar-shell__stage">
          <div class="hypar-shell__pane">
            <AppFloatNav />
            <main class="hypar-shell__main">
              <slot />
            </main>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { theme } = useTerminalPrefs()
</script>
