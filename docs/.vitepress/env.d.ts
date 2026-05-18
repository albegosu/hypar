/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITEPRESS_DEMO_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
