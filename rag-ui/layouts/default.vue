<template>
  <div class="min-h-screen bg-gray-50 dark:app-backdrop text-slate-900 dark:text-slate-100">
    <AppHeader />
    <main class="pb-24">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>
