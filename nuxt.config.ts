import 'dotenv/config'

/** GitHub Pages project sites use a subpath; NUXT_APP_BASE_URL is set in CI (see .github/workflows/pages.yml). */
const pagesSubpath =
  Boolean(process.env.NUXT_APP_BASE_URL?.trim()) &&
  process.env.NUXT_APP_BASE_URL !== '/' &&
  process.env.NUXT_APP_BASE_URL !== ''

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  experimental: {
    // Subpath static hosting: prerender can 404 on app manifest paths (nuxt/nuxt#30367).
    ...(pagesSubpath ? { appManifest: false as const } : {}),
  },
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-monaco-editor',
    'workflow/nuxt',
    './modules/copy-workflow-bundles',
  ],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'dark',
  },

  app: {
    head: {
      title: 'fragua',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'Learn and use RAG (Retrieval-Augmented Generation) — from zero to production.' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  workflow: {
    typescriptPlugin: true,
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL ?? '',
    // Embedding
    embeddingProvider: process.env.EMBEDDING_PROVIDER ?? '',
    embeddingModel: process.env.EMBEDDING_MODEL ?? '',
    embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS ?? 768),
    googleApiKey: process.env.GOOGLE_API_KEY ?? '',
    openaiApiKey: process.env.OPENAI_API_KEY ?? '',
    voyageApiKey: process.env.VOYAGE_API_KEY ?? '',
    // LLM
    llmProvider: process.env.LLM_PROVIDER ?? '',
    ollamaUrl: process.env.OLLAMA_URL ?? 'http://localhost:11434',
    ollamaApiKey: process.env.OLLAMA_API_KEY ?? '',
    ollamaModel: process.env.OLLAMA_MODEL ?? 'nomic-embed-text',
    ollamaLlmModel: process.env.OLLAMA_LLM_MODEL ?? 'tinyllama',
    ollamaChatTimeoutMs: Number(process.env.OLLAMA_CHAT_TIMEOUT_MS ?? 180000),
    ollamaPlannerTimeoutMs: Number(process.env.OLLAMA_PLANNER_TIMEOUT_MS ?? 60000),
    anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
    anthropicModel: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
    mistralApiKey: process.env.MISTRAL_API_KEY ?? '',
    mistralModel: process.env.MISTRAL_MODEL ?? 'mistral-medium-latest',
    openaiLlmModel: process.env.OPENAI_LLM_MODEL ?? 'gpt-4.1-mini',
    // App
    memoryScope: process.env.MEMORY_SCOPE ?? 'local_per_user',
    memoryProactive: process.env.MEMORY_PROACTIVE === 'true',
    adminApiKey: process.env.ADMIN_API_KEY ?? '',
    public: {},
  },

  monacoEditor: {
    locale: 'en',
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
