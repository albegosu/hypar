<script setup lang="ts">
import { ref } from 'vue'

const copied = ref(false)
const cmd = 'git clone https://github.com/albegosu/from-zero-rag'
const display = 'git clone github.com/albegosu/from-zero-rag'

function copy() {
  navigator.clipboard.writeText(cmd)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="ht">
    <button class="ht__box" @click="copy" :aria-label="copied ? 'Copied!' : 'Copy command'">
      <span class="ht__cmd-scroll">
        <span class="ht__prompt">$</span>
        <span class="ht__cmd">{{ display }}</span>
      </span>
      <span class="ht__copy-icon" :class="{ 'ht__copy-icon--done': copied }">
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
    </button>
    <p class="ht__hint">{{ copied ? 'Copied!' : 'Click to copy' }}</p>
  </div>
</template>

<style scoped>
.ht {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  width: 100%;
  max-width: 560px;
  min-width: 0;
  box-sizing: border-box;
}

.ht__box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: 48px;
  padding: 10px 16px 10px 20px;
  box-sizing: border-box;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  cursor: pointer;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  color: var(--vp-c-text-1);
  transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}

/* One logical line: swipe on narrow viewports instead of wrapping $ apart from URL */
.ht__cmd-scroll {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.ht__cmd-scroll::-webkit-scrollbar {
  height: 6px;
}
.ht__cmd-scroll::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--vp-c-text-2) 35%, transparent);
  border-radius: 999px;
}

/* Frosted overlay reads well on dark hero; tokens alone are enough on light. */
html.dark .ht__box {
  background: color-mix(in srgb, var(--vp-c-bg-soft) 55%, transparent);
  border-color: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

html.dark .ht__box:hover {
  background: color-mix(in srgb, var(--vp-c-bg-soft) 72%, transparent);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 50%, rgba(255, 255, 255, 0.2));
  box-shadow: 0 0 16px color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent);
}

html:not(.dark) .ht__box:hover {
  background: color-mix(in srgb, var(--vp-c-bg-soft) 92%, var(--vp-c-bg));
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 38%, var(--vp-c-divider));
  box-shadow: 0 2px 10px color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}

.ht__prompt {
  flex-shrink: 0;
  color: var(--vp-c-text-2);
  user-select: none;
}

.ht__cmd {
  flex-shrink: 0;
  color: var(--vp-c-text-1);
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.ht__copy-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  color: var(--vp-c-text-2);
  transition: color 0.15s ease;
}
.ht__copy-icon svg { width: 15px; height: 15px; }
.ht__box:hover .ht__copy-icon { color: var(--vp-c-text-1); }
.ht__copy-icon--done { color: #4ade80 !important; }

.ht__hint {
  font-size: 11px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin: 0;
  letter-spacing: 0.02em;
  transition: opacity 0.15s;
}
</style>
