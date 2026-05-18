<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md'
  }>(),
  { size: 'sm' },
)
</script>

<template>
  <span class="brand-mark" :class="`brand-mark--${size}`" aria-hidden="true">
    <MicroGlyph name="brandPrompt" decorative />
  </span>
</template>

<style scoped>
.brand-mark :deep(.micro-glyph) {
  width: 0.95rem;
  height: 0.95rem;
}

.brand-mark--md :deep(.micro-glyph) {
  width: 1.05rem;
  height: 1.05rem;
}
</style>
