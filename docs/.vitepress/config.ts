import { defineConfig } from 'vitepress'
import { DEFAULT_DEMO_APP } from './demo-app-url'

const demoAppUrl = process.env.VITEPRESS_DEMO_URL?.trim() || DEFAULT_DEMO_APP
const demoUrlFromEnv = process.env.VITEPRESS_DEMO_URL?.trim() ?? ''

/** GitHub Pages project site: set in CI (e.g. `/from-zero-rag/`). Local dev: omit or `/`. */
function vitepressBase(): string {
  const raw = process.env.VITEPRESS_BASE?.trim()
  if (!raw || raw === '/') return '/'
  const withLeading = raw.startsWith('/') ? raw : `/${raw}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
}

const siteBase = vitepressBase()

export default defineConfig({
  title: 'hypar',
  description: 'Production-ready Retrieval-Augmented Generation app built with Nuxt 3, pgvector and the Vercel AI SDK.',
  base: siteBase,

  vite: {
    define: {
      'import.meta.env.VITEPRESS_DEMO_URL': JSON.stringify(demoUrlFromEnv),
    },
  },

  /** Localhost and legacy archive URLs are intentional in prose. */
  ignoreDeadLinks: [/^http:\/\/localhost/, /^http:\/\/127\.0\.0\.1/],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${siteBase}favicon.svg` }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: `${siteBase}favicon.ico` }],
    ['link', { rel: 'apple-touch-icon', href: `${siteBase}apple-touch-icon.png` }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,600;0,700;1,550&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;1,400&display=swap',
      },
    ],
    ['link', { rel: 'preconnect', href: 'https://api.fontshare.com' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap',
      },
    ],
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Features', link: '/features/rag-pipeline' },
      { text: 'API', link: '/api/reference' },
      { text: 'Architecture', link: '/architecture' },
      { text: 'Roadmap', link: '/roadmap' },
      {
        text: 'Chat app',
        link: demoAppUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
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
          { text: 'Roadmap', link: '/roadmap' },
          { text: 'Contributing', link: '/contributing' },
        ],
      },
      {
        text: 'Design notes',
        items: [
          { text: 'ADR: Monorepo unification', link: '/decisions/monorepo-unification' },
          { text: 'RFC: Auth phases (2026)', link: '/rfcs/2026-auth-phases' },
        ],
      },
    ],

    socialLinks: [
      {
        icon: {
          /* VPSocialLink.css sets `fill: currentColor` on svg — stroke-only icons become a solid square. */
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round" aria-hidden="true"><path d="M4 5h16"/><path d="M4 5v14h16V5"/><path d="M8 9l2 2-2 2"/><path d="M12 13h4"/></svg>',
        },
        link: demoAppUrl,
        ariaLabel: 'Open hosted hypar chat app',
      },
      { icon: 'github', link: 'https://github.com/albegosu/from-zero-rag' },
    ],

    search: { provider: 'local' },

    footer: {
      message: 'MIT License.',
      copyright: 'Powered by Resizes to learn.',
    },

    editLink: {
      pattern: 'https://github.com/albegosu/from-zero-rag/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
})
