<script setup lang="ts">
import type { MicroGlyphName } from './glyphs'
import { GLYPH_PATHS } from './glyphs'

withDefaults(
  defineProps<{
    name: MicroGlyphName
    /** When true, hide from AT (purely decorative). */
    decorative?: boolean
    title?: string
  }>(),
  { decorative: true },
)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="micro-glyph"
    :aria-hidden="decorative ? 'true' : undefined"
    :role="decorative ? undefined : 'img'"
  >
    <title v-if="!decorative && title">{{ title }}</title>
    <g v-html="GLYPH_PATHS[name]" />
  </svg>
</template>

<style scoped>
.micro-glyph {
  display: block;
  width: 1.25em;
  height: 1.25em;
  flex-shrink: 0;
}
</style>
