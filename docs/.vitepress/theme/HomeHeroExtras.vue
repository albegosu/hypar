<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import MicroGlyph from '../../../components/micro/MicroGlyph.vue'
import { demoAppUrl } from '../demo-app-url'
import posterBundled from '../../public/demo/poster.png?url'

const demoUrl = demoAppUrl()
const posterSrc = posterBundled
const videoSrc = withBase('/demo/hero-demo.webm')

type MediaKind = 'poster' | 'video'

const kind = ref<MediaKind>('poster')
const videoEl = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)

/** Dev server returns 200 + text/html for missing files; require a real video MIME. */
async function hasDemoVideo(): Promise<boolean> {
  try {
    const res = await fetch(videoSrc, { method: 'HEAD' })
    if (!res.ok) return false
    const type = res.headers.get('content-type') ?? ''
    return type.startsWith('video/')
  } catch {
    return false
  }
}

onMounted(async () => {
  if (await hasDemoVideo()) kind.value = 'video'
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
      <button
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
.home-demo__play {
  width: 32px;
  height: 32px;
  color: color-mix(in srgb, var(--vp-c-text-1) 90%, transparent);
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
