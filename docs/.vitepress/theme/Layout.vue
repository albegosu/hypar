<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import HomeHeroExtras from './HomeHeroExtras.vue'
import HomeHeroParaboloid from './HomeHeroParaboloid.vue'
import HomeFeaturesExtras from './HomeFeaturesExtras.vue'
import HomeHeroTerminal from './HomeHeroTerminal.vue'
import HomeLandingAnimations from './HomeLandingAnimations.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-hero-info-before>
      <HomeHeroParaboloid />
    </template>
    <template #home-hero-actions-after>
      <HomeHeroTerminal />
    </template>
    <template #home-hero-after>
      <HomeHeroExtras />
    </template>
    <template #home-features-after>
      <HomeFeaturesExtras />
    </template>
  </Layout>
  <HomeLandingAnimations />
</template>
