<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MicroGlyph from '../../../components/micro/MicroGlyph.vue'
import { demoAppUrl } from '../demo-app-url'

const demoUrl = demoAppUrl()
const posterSrc = '/demo/poster.webp'
const videoSrc = '/demo/hero-demo.webm'

type MediaKind = 'loading' | 'placeholder' | 'poster' | 'video'

const kind = ref<MediaKind>('loading')
const videoEl = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)

async function assetExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

onMounted(async () => {
  if (await assetExists(videoSrc)) {
    kind.value = 'video'
    return
  }
  if (await assetExists(posterSrc)) {
    kind.value = 'poster'
    return
  }
  kind.value = 'placeholder'
})

function openDemo() {
  window.open(demoUrl, '_blank', 'noopener,noreferrer')
}

function onMediaClick() {
  if (kind.value === 'video' && videoEl.value) {
    if (videoEl.value.paused) {
      void videoEl.value.play()
      isPlaying.value = true
    } else {
      videoEl.value.pause()
      isPlaying.value = false
    }
    return
  }
  openDemo()
}

function onVideoPlay() {
  isPlaying.value = true
}

function onVideoPause() {
  isPlaying.value = false
}
</script>

<template>
  <section class="home-demo">
    <div class="home-demo__inner">
      <div
        v-if="kind === 'loading'"
        class="home-demo__placeholder home-demo__placeholder--loading"
        aria-busy="true"
      />

      <button
        v-else-if="kind === 'placeholder'"
        type="button"
        class="home-demo__placeholder"
        :aria-label="`Open live demo at ${demoUrl}`"
        @click="openDemo"
      >
        <MicroGlyph name="bracketBl" decorative class="home-demo__corner home-demo__corner--bl" />
        <MicroGlyph name="bracketTr" decorative class="home-demo__corner home-demo__corner--tr" />
        <div class="home-demo__center">
          <MicroGlyph name="play" decorative class="home-demo__play" />
          <p>Demo screenshot or 30-second screencast</p>
          <span class="home-demo__hint">pnpm demo:poster · add hero-demo.webm</span>
        </div>
      </button>

      <button
        v-else
        type="button"
        class="home-demo__media"
        :aria-label="kind === 'video' ? 'Play or pause demo screencast' : 'Open live demo'"
        @click="onMediaClick"
      >
        <video
          v-if="kind === 'video'"
          ref="videoEl"
          class="home-demo__video"
          :src="videoSrc"
          :poster="posterSrc"
          muted
          loop
          playsinline
          preload="metadata"
          @play="onVideoPlay"
          @pause="onVideoPause"
        />
        <img
          v-else
          class="home-demo__poster"
          :src="posterSrc"
          alt="hypar chat with hybrid RAG citations"
          width="1200"
          height="675"
          loading="eager"
          decoding="async"
        />
        <span class="home-demo__overlay" :class="{ 'home-demo__overlay--hidden': kind === 'video' && isPlaying }">
          <MicroGlyph name="play" decorative class="home-demo__play" />
        </span>
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
    </div>
  </section>
</template>

<style scoped>
.home-demo {
  box-sizing: border-box;
  width: 100%;
  max-width: 1280px;
  margin: 2rem auto;
  padding: 0 24px;
}
.home-demo__inner {
  margin: 8px 0 0;
}
.home-demo__placeholder,
.home-demo__media {
  position: relative;
  width: 100%;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  display: block;
  text-align: inherit;
  font: inherit;
}
.home-demo__placeholder {
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
}
.home-demo__placeholder--loading {
  cursor: default;
  animation: home-demo-pulse 1.2s ease-in-out infinite;
}
.home-demo__media {
  aspect-ratio: 16 / 9;
  max-height: min(52vh, 420px);
}
.home-demo__video,
.home-demo__poster {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  vertical-align: middle;
}
.home-demo__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--vp-c-bg) 35%, transparent);
  transition: opacity 0.2s ease;
  pointer-events: none;
}
.home-demo__overlay--hidden {
  opacity: 0;
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
.home-demo__corner {
  position: absolute;
  width: 40px;
  height: 40px;
  color: color-mix(in srgb, var(--vp-c-text-3) 55%, transparent);
  pointer-events: none;
}
.home-demo__corner--bl {
  left: 12px;
  bottom: 12px;
}
.home-demo__corner--tr {
  right: 12px;
  top: 12px;
}
.home-demo__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
}
.home-demo__play {
  width: 32px;
  height: 32px;
  color: color-mix(in srgb, var(--vp-c-text-1) 90%, transparent);
}
.home-demo__placeholder p {
  font-size: 13px;
  margin: 0;
}
.home-demo__hint {
  font-size: 11px;
  opacity: 0.65;
  font-family: var(--vp-font-family-mono);
}
@keyframes home-demo-pulse {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
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
}
</style>
