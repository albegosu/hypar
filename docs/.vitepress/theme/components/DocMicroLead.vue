<script setup lang="ts">
import MicroGlyph from '../../../../components/micro/MicroGlyph.vue'
</script>

<template>
  <div class="doc-micro-lead" aria-hidden="true">
    <MicroGlyph name="sparkle" class="doc-micro-lead__spark" decorative />
    <MicroGlyph name="sectionRule" class="doc-micro-lead__rule" decorative />
  </div>
</template>

<style scoped>
.doc-micro-lead {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 20px;
  color: var(--vp-c-text-3);
  opacity: 0.85;
}
.doc-micro-lead__spark {
  width: 22px;
  height: 22px;
}
.doc-micro-lead__rule {
  flex: 1;
  min-width: 48px;
  max-width: 120px;
  height: 22px;
}
</style>
