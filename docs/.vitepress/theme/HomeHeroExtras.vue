<script setup lang="ts">
import MicroGlyph from '../../../components/micro/MicroGlyph.vue'

// Demo placeholder. Replace `kind` with `'screencast'` and add a video src
// when the public hosted demo is ready (Stage 10 of PRODUCT-ROADMAP.md).
const kind: 'placeholder' | 'screencast' = 'placeholder'
</script>

<template>
  <section class="home-demo">
    <div class="home-demo__inner">
      <div v-if="kind === 'placeholder'" class="home-demo__placeholder">
        <MicroGlyph name="bracketBl" decorative class="home-demo__corner home-demo__corner--bl" />
        <MicroGlyph name="bracketTr" decorative class="home-demo__corner home-demo__corner--tr" />
        <div class="home-demo__center">
          <MicroGlyph name="play" decorative class="home-demo__play" />
          <p>Demo screenshot or 30-second screencast</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Same width + horizontal padding rhythm as VPHomeContent / VPFeatures (.vp-doc.container) */
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
.home-demo__placeholder {
  position: relative;
  height: 240px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  overflow: hidden;
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
  color: color-mix(in srgb, var(--vp-c-text-2) 90%, transparent);
}
.home-demo__placeholder p {
  font-size: 13px;
  margin: 0;
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
