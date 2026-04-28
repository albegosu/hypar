<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useProgressStore } from '~/stores/progress';

const progress = useProgressStore();

useHead({
  htmlAttrs: {
    lang: 'en',
  },
});

onMounted(() => {
  progress.loadProgress();
});
</script>
