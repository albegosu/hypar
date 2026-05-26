/**
 * Hosted Nuxt chat app URL — safe for VitePress client components (no `process`).
 * Nav/config uses `demoAppUrlFromEnv()` in config.ts (Node only).
 */
export const DEFAULT_DEMO_APP = 'https://hypar.up.railway.app/'

export function demoAppUrl(): string {
  const injected = import.meta.env.VITEPRESS_DEMO_URL
  if (typeof injected === 'string' && injected.trim()) return injected.trim()
  return DEFAULT_DEMO_APP
}
