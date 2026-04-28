<template>
  <header class="sticky top-0 z-50 glass hairline-b">
    <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <span class="brand-mark">
          <UIcon name="i-heroicons-cube" class="w-4 h-4" />
        </span>
        <h1 class="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
          PKM <span class="text-violet-600 dark:text-violet-400">RAG</span>
        </h1>
      </NuxtLink>

      <UButton
        icon="i-heroicons-plus"
        color="primary"
        size="sm"
        @click="navigateTo('/upload')"
      >
        Add
      </UButton>
    </div>
  </header>
</template>
