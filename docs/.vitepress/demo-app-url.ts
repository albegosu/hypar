/**
 * Hosted Nuxt chat app URL for the docs site (landing).
 * Override at build: `VITEPRESS_DEMO_URL=... pnpm docs:build`.
 * Keep the same default in `docs/index.md` hero → Try demo link.
 */
const DEFAULT_DEMO_APP = 'https://from-zero-rag-production.up.railway.app/'

export function demoAppUrl(): string {
  const fromEnv = process.env.VITEPRESS_DEMO_URL?.trim()
  if (fromEnv) return fromEnv
  return DEFAULT_DEMO_APP
}
