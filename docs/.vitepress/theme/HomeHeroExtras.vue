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
.home-demo {
  max-width: 1152px;
  margin: 0 auto;
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
  color: var(--vp-c-text-3);
}
.home-demo__icon {
  width: 32px;
  height: 32px;
}
.home-demo__placeholder p {
  font-size: 13px;
  margin: 0;
}
@media (min-width: 768px) {
  .home-demo {
    padding: 0 48px;
  }
}
</style>
