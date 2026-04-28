<template>
  <div class="terminal-theme min-h-screen app-backdrop text-emerald-100">
    <AppHeader />
    <main class="pb-24">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>
