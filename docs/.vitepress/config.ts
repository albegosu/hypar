import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'From Zero RAG',
  description: 'Production-ready Retrieval-Augmented Generation app built with Nuxt 3, pgvector and the Vercel AI SDK.',
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Features', link: '/features/rag-pipeline' },
      { text: 'API', link: '/api/reference' },
      { text: 'Architecture', link: '/architecture' },
      {
        text: 'GitHub',
        link: 'https://github.com/albegosu/from-zero-rag',
        target: '_blank',
      },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Docker (development)', link: '/guide/docker' },
          { text: 'Production Deployment', link: '/guide/production' },
          { text: 'Environment Variables', link: '/guide/env' },
        ],
      },
      {
        text: 'Features',
        items: [
          { text: 'RAG Pipeline', link: '/features/rag-pipeline' },
          { text: 'Hybrid Search & HyDE', link: '/features/search' },
          { text: 'Memory & Commands', link: '/features/memory' },
          { text: 'Learning Quest', link: '/features/learning-quest' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API Reference', link: '/api/reference' },
          { text: 'Architecture', link: '/architecture' },
          { text: 'Contributing', link: '/contributing' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/albegosu/from-zero-rag' },
    ],

    search: { provider: 'local' },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Built by Alberto González to learn RAG from scratch.',
    },

    editLink: {
      pattern: 'https://github.com/albegosu/from-zero-rag/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
})
