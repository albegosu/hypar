<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import HomeHeroExtras from './HomeHeroExtras.vue'
import HomeFeaturesExtras from './HomeFeaturesExtras.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-hero-after>
      <HomeHeroExtras />
    </template>
    <template #home-features-after>
      <HomeFeaturesExtras />
    </template>
  </Layout>
</template>
