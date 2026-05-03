import 'dotenv/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
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
      title: 'From Zero RAG',
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
    googleApiKey: process.env.GOOGLE_API_KEY ?? '',
    openaiApiKey: process.env.OPENAI_API_KEY ?? '',
    ollamaUrl: process.env.OLLAMA_URL ?? 'http://localhost:11434',
    ollamaApiKey: process.env.OLLAMA_API_KEY ?? '',
    ollamaModel: process.env.OLLAMA_MODEL ?? 'nomic-embed-text',
    ollamaLlmModel: process.env.OLLAMA_LLM_MODEL ?? 'tinyllama',
    ollamaChatTimeoutMs: Number(process.env.OLLAMA_CHAT_TIMEOUT_MS ?? 180000),
    ollamaPlannerTimeoutMs: Number(process.env.OLLAMA_PLANNER_TIMEOUT_MS ?? 60000),
    embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS ?? 768),
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
