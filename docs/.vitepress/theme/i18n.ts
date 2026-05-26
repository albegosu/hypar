import { useData } from 'vitepress'
import { computed } from 'vue'

const strings = {
  en: {
    whatIs: {
      eyebrow: 'What is hypar?',
      description:
        'RAG (Retrieval-Augmented Generation) lets an AI answer questions from your own documents — but production RAG is hard: chunking strategy, hybrid retrieval, durable ingestion, citations, evals. hypar is a fully-working TypeScript reference app. Read the code like a tutorial, run it locally in minutes, adapt the patterns to your stack.',
      audiences: ['Devs learning RAG', 'Teams shipping RAG', 'Researchers benchmarking'],
    },
    quickStart: {
      eyebrow: 'Run locally',
      dockerLabel: 'Docker',
      pnpmLabel: 'pnpm',
      copyBtn: 'Copy',
      copiedBtn: 'Copied!',
      guideLink: 'Full setup guide →',
    },
    architecture: {
      eyebrow: 'Architecture at a glance',
      nodeClient: 'Vue 3 — pages + components',
      nodeServer: 'Nitro — API routes (h3)',
      nodeWorkflow: 'Workflow SDK — durable ingest',
      nodeDb: 'PostgreSQL + pgvector',
      nodeProviders: 'Gemini · OpenAI · Ollama',
      labelIngest: 'upload / reprocess',
      labelRetrieve: 'hybrid search + HyDE',
      labelEmbed: 'embed / generate',
      link: 'Read the full architecture →',
    },
    demoPrompts: {
      label: 'Try these in the demo:',
      note: 'Pre-loaded with the hypar docs — ask anything.',
      prompts: [
        'What is HyDE and when is it useful?',
        'Compare BM25 and vector search',
        'Explain the ingestion workflow',
      ],
    },
    highlights: [
      {
        title: 'Hybrid retrieval',
        details: 'pgvector cosine similarity combined with BM25, then MMR diversification.',
      },
      {
        title: 'Multi-provider embeddings',
        details: 'Gemini, OpenAI or Ollama. Switch at runtime without re-ingesting.',
      },
      {
        title: 'Durable ingestion',
        details: 'Workflow SDK with per-step retries; status polled, never lost on restart.',
      },
      {
        title: 'Vitest suite',
        details: 'Chunking, text helpers, agent commands, and search utilities covered in CI.',
      },
      {
        title: 'Source citations',
        details: 'Inline [1], [2] markers persisted on every assistant message and audited.',
      },
      {
        title: 'Rate limits and admin APIs',
        details:
          '30/min chat, 10/min upload. /api/admin/* accepts a signed-in session or ADMIN_API_KEY.',
      },
    ],
    whatsInside: "What's inside",
    roadmapLabel: 'Roadmap — 10 stages',
    viewRoadmap: 'View full roadmap →',
    learner: {
      title: 'Learning RAG from zero?',
      details: 'Start with the getting-started guide and feature chapters.',
      cta: 'Open the guide →',
    },
    contributor: {
      title: 'Want to contribute?',
      details:
        'Browse open issues on GitHub — good first issues are tagged and ready to pick up.',
      cta: 'See open issues →',
    },
  },
  es: {
    whatIs: {
      eyebrow: '¿Qué es hypar?',
      description:
        'RAG (Retrieval-Augmented Generation) permite a una IA responder preguntas desde tus propios documentos — pero RAG en producción es difícil: estrategia de chunking, búsqueda híbrida, ingestión durable, citas, evaluaciones. hypar es una app de referencia en TypeScript completamente funcional. Lee el código como un tutorial, arráncala localmente en minutos y adapta los patrones a tu stack.',
      audiences: ['Devs aprendiendo RAG', 'Equipos desplegando RAG', 'Investigadores haciendo benchmarks'],
    },
    quickStart: {
      eyebrow: 'Ejecutar localmente',
      dockerLabel: 'Docker',
      pnpmLabel: 'pnpm',
      copyBtn: 'Copiar',
      copiedBtn: '¡Copiado!',
      guideLink: 'Guía de instalación completa →',
    },
    architecture: {
      eyebrow: 'Arquitectura en un vistazo',
      nodeClient: 'Vue 3 — páginas + componentes',
      nodeServer: 'Nitro — rutas API (h3)',
      nodeWorkflow: 'Workflow SDK — ingestión durable',
      nodeDb: 'PostgreSQL + pgvector',
      nodeProviders: 'Gemini · OpenAI · Ollama',
      labelIngest: 'subida / reprocesado',
      labelRetrieve: 'búsqueda híbrida + HyDE',
      labelEmbed: 'embed / generación',
      link: 'Leer la arquitectura completa →',
    },
    demoPrompts: {
      label: 'Prueba en el demo:',
      note: 'Precargado con los docs de hypar — pregunta lo que quieras.',
      prompts: [
        '¿Qué es HyDE y cuándo es útil?',
        'Compara BM25 con búsqueda vectorial',
        'Explica el flujo de ingestión de documentos',
      ],
    },
    highlights: [
      {
        title: 'Búsqueda híbrida',
        details: 'Similitud coseno de pgvector combinada con BM25 y diversificación MMR.',
      },
      {
        title: 'Embeddings multi-proveedor',
        details: 'Gemini, OpenAI u Ollama. Cambia en runtime sin re-ingestar.',
      },
      {
        title: 'Ingestión durable',
        details: 'Workflow SDK con reintentos por paso; estado consultado, nunca perdido en reinicios.',
      },
      {
        title: 'Suite Vitest',
        details: 'Chunking, utilidades de texto, comandos de agente y búsqueda cubiertos en CI.',
      },
      {
        title: 'Citas de fuentes',
        details: 'Marcadores [1], [2] persistidos en cada mensaje del asistente y auditados.',
      },
      {
        title: 'Rate limits y APIs de admin',
        details:
          '30/min chat, 10/min subida. /api/admin/* acepta sesión iniciada o ADMIN_API_KEY.',
      },
    ],
    whatsInside: 'Qué incluye',
    roadmapLabel: 'Roadmap — 10 etapas',
    viewRoadmap: 'Ver el roadmap completo →',
    learner: {
      title: '¿Aprendiendo RAG desde cero?',
      details: 'Empieza con la guía de inicio y los capítulos de features.',
      cta: 'Abrir la guía →',
    },
    contributor: {
      title: '¿Quieres contribuir?',
      details:
        'Explora los issues abiertos en GitHub — los "good first issues" están etiquetados y listos.',
      cta: 'Ver issues →',
    },
  },
}

export type LangStrings = typeof strings.en

export function useI18n() {
  const { lang } = useData()
  return computed<LangStrings>(() => strings[lang.value?.startsWith('es') ? 'es' : 'en'])
}
