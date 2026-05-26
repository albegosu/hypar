<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { demoAppUrl } from '../demo-app-url'
import { useI18n } from './i18n'
import screenshotDark from '/demo/hypar-chat-dark.png'
import screenshotLight from '/demo/hypar-chat-light.png'

const demoUrl = demoAppUrl()
const { isDark } = useData()
const t = useI18n()

const screenshotSrc = computed(() => (isDark.value ? screenshotDark : screenshotLight))

function openDemo() {
  window.open(demoUrl, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <section class="home-demo">
    <div class="home-demo__inner">
      <button
        type="button"
        class="home-demo__media"
        :class="{ 'home-demo__media--dark': isDark }"
        aria-label="Open live hypar chat demo"
        @click="openDemo"
      >
        <img
          class="home-demo__shot"
          :src="screenshotSrc"
          alt="hypar chat — RAG pipeline, conversations, and document sidebar"
          width="3588"
          height="1896"
          loading="eager"
          decoding="async"
        />
        <a
          class="home-demo__live"
          :href="demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
        >
          Live demo ↗
        </a>
      </button>

      <!-- Demo prompt hints -->
      <div class="home-demo__hints">
        <p class="home-demo__hints-label">{{ t.demoPrompts.label }}</p>
        <div class="home-demo__hints-row">
          <a
            v-for="prompt in t.demoPrompts.prompts"
            :key="prompt"
            class="home-demo__prompt"
            :href="demoUrl"
            target="_blank"
            rel="noopener noreferrer"
          >{{ prompt }}</a>
        </div>
        <p class="home-demo__hints-note">{{ t.demoPrompts.note }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-demo {
  box-sizing: border-box;
  margin: 2rem auto 0;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.home-demo__inner {
  margin: 8px 0 0;
  margin-inline: auto;
}
.home-demo__media {
  position: relative;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  background: #f5f1e8;
  display: block;
  text-align: inherit;
  font: inherit;
  aspect-ratio: 16 / 9;
  max-height: clamp(300px, 58vh, 560px);
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
  box-shadow:
    0 1px 0 color-mix(in srgb, var(--vp-c-text-1) 6%, transparent) inset,
    0 20px 48px -24px color-mix(in srgb, var(--vp-c-bg) 35%, #000 25%);
}
.home-demo__media--dark {
  background: #0a0e0d;
}
.home-demo__shot {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 44%;
  vertical-align: middle;
}
.home-demo__live {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 2;
  font-size: 11px;
  font-family: var(--vp-font-family-mono);
  padding: 4px 10px;
  border-radius: 6px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  background: color-mix(in srgb, var(--vp-c-bg) 75%, transparent);
  border: 1px solid var(--vp-c-divider);
  pointer-events: auto;
}
.home-demo__live:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

/* Prompt hints */
.home-demo__hints {
  margin-top: 14px;
  padding: 0 4px;
}
.home-demo__hints-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  margin: 0 0 8px;
}
.home-demo__hints-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.home-demo__prompt {
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 5px 11px;
  text-decoration: none;
  transition: color 0.12s, border-color 0.12s;
  white-space: nowrap;
}
.home-demo__prompt:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.home-demo__hints-note {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin: 8px 0 0;
  font-family: var(--vp-font-family-mono);
  letter-spacing: 0.02em;
}

@media (min-width: 640px) {
  .home-demo {
    padding: 0 48px;
  }
}
@media (min-width: 960px) {
  .home-demo {
    padding: 0 64px;
  }
  .home-demo__shot {
    object-position: 50% 42%;
  }
}
</style>
