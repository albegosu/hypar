<script setup lang="ts">
// Demo placeholder. Replace `kind` with `'screencast'` and add a video src
// when the public hosted demo is ready (Stage 10 of PRODUCT-ROADMAP.md).
const kind: 'placeholder' | 'screencast' = 'placeholder'
</script>

<template>
  <section class="home-demo">
    <div class="home-demo__inner">
      <div v-if="kind === 'placeholder'" class="home-demo__placeholder">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="home-demo__icon"
        >
          <path d="M7 4v16l13 -8z" />
        </svg>
        <p>Demo screenshot or 30-second screencast</p>
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
  height: 240px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--vp-c-text-2);
}
.home-demo__icon {
  width: 32px;
  height: 32px;
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
