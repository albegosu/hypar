<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useProgressStore } from '~/stores/progress'

const progress = useProgressStore()

onMounted(() => {
  progress.loadProgress()
})
</script>
