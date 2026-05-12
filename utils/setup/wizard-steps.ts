/**
 * RAG Onboarding Wizard - Step Definitions
 * 6-step guided experience to build a complete RAG system
 *
 * Each step defines its educational content AND its `configFields`,
 * which the WizardConfigForm renders generically. The same fields
 * feed `envSnippet()` to produce a live preview of the resulting `.env`.
 */

import type { WizardStep, WizardConfig } from './wizard-types';
import { embeddingProviders, llmProviders, embeddingProviderMap, llmProviderMap } from './providers.catalog';

const get = (cfg: WizardConfig, stepId: string, key: string, fallback: any = '') =>
  cfg[stepId]?.[key] ?? fallback;

export const step1: WizardStep = {
  id: 'apis',
  order: 1,
  title: 'wizard.steps.apis.title',
  subtitle: 'wizard.steps.apis.subtitle',
  icon: 'i-heroicons-key',

  whatWeAreBbuilding: 'wizard.steps.apis.what',
  whyWeNeedThis: 'wizard.steps.apis.why',

  keyBenefits: ['wizard.steps.apis.benefits.0', 'wizard.steps.apis.benefits.1', 'wizard.steps.apis.benefits.2', 'wizard.steps.apis.benefits.3'],

  configFields: [
    {
      id: 'embeddingProvider',
      label: 'EMBEDDING_PROVIDER',
      type: 'select',
      envKey: 'EMBEDDING_PROVIDER',
      defaultValue: 'openai',
      required: true,
      options: embeddingProviders.map((provider) => ({ value: provider.id, label: provider.id })),
    },
    ...embeddingProviders.flatMap((provider) => provider.fields),
    {
      id: 'llmProvider',
      label: 'LLM_PROVIDER',
      type: 'select',
      envKey: 'LLM_PROVIDER',
      defaultValue: 'anthropic',
      required: true,
      options: llmProviders.map((provider) => ({ value: provider.id, label: provider.id })),
    },
    ...llmProviders.flatMap((provider) => provider.fields),
  ],

  envSnippet: (cfg) => {
    const embeddingProvider = get(cfg, 'apis', 'embeddingProvider', 'openai');
    const llmProvider = get(cfg, 'apis', 'llmProvider', 'anthropic');

    const lines: string[] = [
      '# AI services',
      `EMBEDDING_PROVIDER=${embeddingProvider}`,
      `LLM_PROVIDER=${llmProvider}`,
    ];
    const activeEmbeddingProvider = embeddingProviderMap.get(embeddingProvider);
    const activeLlmProvider = llmProviderMap.get(llmProvider);
    if (activeEmbeddingProvider) lines.push(...activeEmbeddingProvider.envLines(cfg));
    if (activeLlmProvider) lines.push(...activeLlmProvider.envLines(cfg));

    return lines.join('\n');
  },

  hasCodePreview: true,
  codeSnippet: {
    filename: '.env',
    language: 'bash',
    code: '',
    explanation: 'wizard.steps.apis.codeExplanation',
  },

  canProceed: (cfg) => {
    const embeddingProvider = get(cfg, 'apis', 'embeddingProvider', 'openai');
    const llmProvider = get(cfg, 'apis', 'llmProvider', 'anthropic');
    const activeEmbeddingProvider = embeddingProviderMap.get(embeddingProvider);
    const activeLlmProvider = llmProviderMap.get(llmProvider);
    if (!activeEmbeddingProvider || !activeLlmProvider) return false;

    const hasAllEmbeddingRequired = activeEmbeddingProvider.required.every((key) => !!get(cfg, 'apis', key));
    const hasAllLlmRequired = activeLlmProvider.required.every((key) => !!get(cfg, 'apis', key));
    return hasAllEmbeddingRequired && hasAllLlmRequired;
  },
};

function buildDatabaseUrl(cfg: WizardConfig): string {
  const type = get(cfg, 'vectorDb', 'vectorDbType', 'pgvector');
  if (type === 'supabase') {
    const ref = get(cfg, 'vectorDb', 'supabaseProjectRef', '<project-ref>');
    const password = get(cfg, 'vectorDb', 'supabaseDbPassword', '<password>');
    const mode = get(cfg, 'vectorDb', 'supabasePoolMode', 'direct');
    if (mode === 'transaction') {
      return `postgresql://postgres.${ref}:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;
    }
    return `postgresql://postgres:${password}@db.${ref}.supabase.co:5432/postgres`;
  }
  const host = get(cfg, 'vectorDb', 'dbHost', 'localhost');
  const port = get(cfg, 'vectorDb', 'dbPort', 5432);
  const name = get(cfg, 'vectorDb', 'dbName', 'rag_db');
  const user = get(cfg, 'vectorDb', 'dbUser', 'postgres');
  const password = get(cfg, 'vectorDb', 'dbPassword', 'postgres');
  return `postgresql://${user}:${password}@${host}:${port}/${name}`;
}

export const step2: WizardStep = {
  id: 'vectorDb',
  order: 2,
  title: 'wizard.steps.vectorDb.title',
  subtitle: 'wizard.steps.vectorDb.subtitle',
  icon: 'i-heroicons-circle-stack',

  whatWeAreBbuilding: 'wizard.steps.vectorDb.what',
  whyWeNeedThis: 'wizard.steps.vectorDb.why',
  keyBenefits: ['wizard.steps.vectorDb.benefits.0', 'wizard.steps.vectorDb.benefits.1', 'wizard.steps.vectorDb.benefits.2', 'wizard.steps.vectorDb.benefits.3'],

  configFields: [
    {
      id: 'vectorDbType',
      label: 'db_type',
      type: 'select',
      envKey: 'VECTOR_DB_TYPE',
      defaultValue: 'pgvector',
      required: true,
      options: [
        { value: 'pgvector', label: 'Self-hosted pgvector' },
        { value: 'supabase', label: 'Supabase Vector' },
      ],
    },
    // pgvector fields
    { id: 'dbHost', label: 'DB_HOST', type: 'text', envKey: 'DB_HOST', defaultValue: 'localhost', required: true, dependsOn: { field: 'vectorDbType', equals: 'pgvector' } },
    { id: 'dbPort', label: 'DB_PORT', type: 'number', envKey: 'DB_PORT', defaultValue: 5432, min: 1, max: 65535, required: true, dependsOn: { field: 'vectorDbType', equals: 'pgvector' } },
    { id: 'dbName', label: 'DB_NAME', type: 'text', envKey: 'DB_NAME', defaultValue: 'rag_db', required: true, dependsOn: { field: 'vectorDbType', equals: 'pgvector' } },
    { id: 'dbUser', label: 'DB_USER', type: 'text', envKey: 'DB_USER', advanced: true, defaultValue: 'postgres', dependsOn: { field: 'vectorDbType', equals: 'pgvector' } },
    { id: 'dbPassword', label: 'DB_PASSWORD', type: 'password', envKey: 'DB_PASSWORD', advanced: true, secret: true, defaultValue: 'postgres', dependsOn: { field: 'vectorDbType', equals: 'pgvector' } },
    // Supabase fields
    {
      id: 'supabaseProjectRef',
      label: 'project_ref',
      type: 'text',
      envKey: 'SUPABASE_PROJECT_REF',
      placeholder: 'abcdefghijklmnopqrst',
      required: true,
      helpText: 'wizard.fields.supabaseProjectRef.helpText',
      externalLink: { text: 'wizard.fields.external.dashboard', url: 'https://supabase.com/dashboard' },
      dependsOn: { field: 'vectorDbType', equals: 'supabase' },
    },
    {
      id: 'supabaseDbPassword',
      label: 'db_password',
      type: 'password',
      envKey: 'SUPABASE_DB_PASSWORD',
      placeholder: '...',
      required: true,
      secret: true,
      helpText: 'wizard.fields.supabaseDbPassword.helpText',
      dependsOn: { field: 'vectorDbType', equals: 'supabase' },
    },
    {
      id: 'supabasePoolMode',
      label: 'pool_mode',
      type: 'select',
      envKey: 'SUPABASE_POOL_MODE',
      defaultValue: 'direct',
      advanced: true,
      helpText: 'wizard.fields.supabasePoolMode.helpText',
      options: [
        { value: 'direct', label: 'Direct (port 5432)' },
        { value: 'transaction', label: 'Transaction pooler (port 6543)' },
      ],
      dependsOn: { field: 'vectorDbType', equals: 'supabase' },
    },
    // Shared advanced fields
    {
      id: 'distanceMetric',
      label: 'VECTOR_DISTANCE',
      type: 'select',
      envKey: 'VECTOR_DISTANCE',
      advanced: true,
      defaultValue: 'cosine',
      options: [
        { value: 'cosine', label: 'cosine (<=>)' },
        { value: 'l2', label: 'L2 / euclidean (<->)' },
        { value: 'ip', label: 'inner product (<#>)' },
      ],
    },
    { id: 'hnswM', label: 'HNSW_M', type: 'number', envKey: 'HNSW_M', advanced: true, defaultValue: 16, min: 4, max: 64 },
    { id: 'hnswEfConstruction', label: 'HNSW_EF', type: 'number', envKey: 'HNSW_EF_CONSTRUCTION', advanced: true, defaultValue: 64, min: 16, max: 512 },
  ],

  envSnippet: (cfg) => {
    const type = get(cfg, 'vectorDb', 'vectorDbType', 'pgvector');
    const databaseUrl = buildDatabaseUrl(cfg);
    const commonVars = [
      `DATABASE_URL=${databaseUrl}`,
      `VECTOR_DB_TYPE=${type}`,
      `VECTOR_DISTANCE=${get(cfg, 'vectorDb', 'distanceMetric', 'cosine')}`,
      `HNSW_M=${get(cfg, 'vectorDb', 'hnswM', 16)}`,
      `HNSW_EF_CONSTRUCTION=${get(cfg, 'vectorDb', 'hnswEfConstruction', 64)}`,
    ];

    if (type === 'pgvector') {
      return `# Vector database (self-hosted pgvector)
${commonVars.join('\n')}
# PostgreSQL container config (docker-compose)
POSTGRES_USER=${get(cfg, 'vectorDb', 'dbUser', 'postgres')}
POSTGRES_PASSWORD=${get(cfg, 'vectorDb', 'dbPassword', 'postgres')}
POSTGRES_DB=${get(cfg, 'vectorDb', 'dbName', 'rag_db')}`;
    }

    return `# Vector database (Supabase)
${commonVars.join('\n')}`;
  },

  hasCodePreview: true,
  codeSnippet: {
    filename: 'docker-compose.yml',
    language: 'yaml',
    code: `services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`,
    explanation: 'wizard.steps.vectorDb.codeExplanation',
  },

  canProceed: (cfg) => {
    const type = get(cfg, 'vectorDb', 'vectorDbType', 'pgvector');
    if (type === 'supabase') {
      return !!get(cfg, 'vectorDb', 'supabaseProjectRef') && !!get(cfg, 'vectorDb', 'supabaseDbPassword');
    }
    return true;
  },
};

export const step3: WizardStep = {
  id: 'embeddings',
  order: 3,
  title: 'wizard.steps.embeddings.title',
  subtitle: 'wizard.steps.embeddings.subtitle',
  icon: 'i-heroicons-cpu-chip',

  whatWeAreBbuilding: 'wizard.steps.embeddings.what',
  whyWeNeedThis: 'wizard.steps.embeddings.why',
  keyBenefits: ['wizard.steps.embeddings.benefits.0', 'wizard.steps.embeddings.benefits.1', 'wizard.steps.embeddings.benefits.2', 'wizard.steps.embeddings.benefits.3'],

  configFields: [
    { id: 'batchSize', label: 'EMBEDDING_BATCH_SIZE', type: 'number', envKey: 'EMBEDDING_BATCH_SIZE', defaultValue: 32, min: 1, max: 256 },
    { id: 'cacheEnabled', label: 'cache', type: 'checkbox', envKey: 'EMBEDDING_CACHE_ENABLED', defaultValue: true, helpText: 'cache repeated queries' },
    { id: 'cacheTtlSeconds', label: 'EMBEDDING_CACHE_TTL', type: 'number', envKey: 'EMBEDDING_CACHE_TTL', advanced: true, defaultValue: 3600, min: 0, max: 604800, unit: 'sec', dependsOn: { field: 'cacheEnabled', equals: true } },
    { id: 'retryAttempts', label: 'EMBEDDING_RETRY_ATTEMPTS', type: 'number', envKey: 'EMBEDDING_RETRY_ATTEMPTS', advanced: true, defaultValue: 3, min: 0, max: 10 },
  ],

  envSnippet: (cfg) => `# Embedding service
EMBEDDING_BATCH_SIZE=${get(cfg, 'embeddings', 'batchSize', 32)}
EMBEDDING_CACHE_ENABLED=${get(cfg, 'embeddings', 'cacheEnabled', true)}
EMBEDDING_CACHE_TTL=${get(cfg, 'embeddings', 'cacheTtlSeconds', 3600)}
EMBEDDING_RETRY_ATTEMPTS=${get(cfg, 'embeddings', 'retryAttempts', 3)}`,

  hasCodePreview: true,
  codeSnippet: {
    filename: 'embedding.service.ts',
    language: 'typescript',
    code: `export class EmbeddingService {
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/gemini-embedding-001:embedContent',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': process.env.GOOGLE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: { parts: [{ text }] } }),
      }
    );
    const data = await response.json();
    return data.embedding.values; // 768 dimensions
  }
}`,
    explanation: 'wizard.steps.embeddings.codeExplanation',
  },

  canProceed: () => true,
};

export const step4: WizardStep = {
  id: 'chunking',
  order: 4,
  title: 'wizard.steps.chunking.title',
  subtitle: 'wizard.steps.chunking.subtitle',
  icon: 'i-heroicons-document-text',

  whatWeAreBbuilding: 'wizard.steps.chunking.what',
  whyWeNeedThis: 'wizard.steps.chunking.why',
  keyBenefits: ['wizard.steps.chunking.benefits.0', 'wizard.steps.chunking.benefits.1', 'wizard.steps.chunking.benefits.2', 'wizard.steps.chunking.benefits.3'],

  configFields: [
    {
      id: 'chunkStrategy',
      label: 'CHUNK_STRATEGY',
      type: 'select',
      envKey: 'CHUNK_STRATEGY',
      defaultValue: 'sentence-aware',
      required: true,
      options: [
        { value: 'sentence-aware', label: 'sentence-aware' },
        { value: 'fixed', label: 'fixed' },
        { value: 'with-overlap', label: 'with-overlap' },
      ],
    },
    { id: 'chunkSize', label: 'CHUNK_SIZE', type: 'number', envKey: 'CHUNK_SIZE', defaultValue: 512, min: 128, max: 2048, step: 32, unit: 'chars', required: true },
    { id: 'overlap', label: 'CHUNK_OVERLAP', type: 'slider', envKey: 'CHUNK_OVERLAP', defaultValue: 50, min: 0, max: 200, unit: 'chars', dependsOn: { field: 'chunkStrategy', equals: 'with-overlap' } },
    { id: 'maxDocSizeMb', label: 'MAX_DOC_SIZE_MB', type: 'number', envKey: 'MAX_DOC_SIZE_MB', advanced: true, defaultValue: 25, min: 1, max: 500, unit: 'MB' },
    {
      id: 'allowedFormats',
      label: 'ALLOWED_FORMATS',
      type: 'tags',
      envKey: 'ALLOWED_FORMATS',
      advanced: true,
      defaultValue: ['pdf', 'md', 'txt'],
    },
  ],

  envSnippet: (cfg) => `# Document processing
CHUNK_STRATEGY=${get(cfg, 'chunking', 'chunkStrategy', 'sentence-aware')}
CHUNK_SIZE=${get(cfg, 'chunking', 'chunkSize', 512)}
CHUNK_OVERLAP=${get(cfg, 'chunking', 'overlap', 50)}
MAX_DOC_SIZE_MB=${get(cfg, 'chunking', 'maxDocSizeMb', 25)}
ALLOWED_FORMATS=${(get(cfg, 'chunking', 'allowedFormats', ['pdf', 'md', 'txt']) as string[]).join(',')}`,

  hasCodePreview: true,
  codeSnippet: {
    filename: 'chunking.service.ts',
    language: 'typescript',
    code: `export class ChunkingService {
  chunkDocument(content: string): string[] {
    const chunkSize = +process.env.CHUNK_SIZE!;
    const overlap = +process.env.CHUNK_OVERLAP!;
    const chunks: string[] = [];
    for (let i = 0; i < content.length; i += chunkSize - overlap) {
      chunks.push(content.slice(i, i + chunkSize));
    }
    return chunks;
  }
}`,
    explanation: 'wizard.steps.chunking.codeExplanation',
  },

  canProceed: () => true,
};

export const step5: WizardStep = {
  id: 'search',
  order: 5,
  title: 'wizard.steps.search.title',
  subtitle: 'wizard.steps.search.subtitle',
  icon: 'i-heroicons-magnifying-glass',

  whatWeAreBbuilding: 'wizard.steps.search.what',
  whyWeNeedThis: 'wizard.steps.search.why',
  keyBenefits: ['wizard.steps.search.benefits.0', 'wizard.steps.search.benefits.1', 'wizard.steps.search.benefits.2', 'wizard.steps.search.benefits.3'],

  configFields: [
    { id: 'topK', label: 'SEARCH_TOP_K', type: 'number', envKey: 'SEARCH_TOP_K', defaultValue: 5, min: 1, max: 50, required: true },
    { id: 'similarityThreshold', label: 'SEARCH_THRESHOLD', type: 'slider', envKey: 'SEARCH_THRESHOLD', defaultValue: 0.2, min: 0, max: 1, step: 0.05 },
    { id: 'useHybridSearch', label: 'SEARCH_HYBRID', type: 'checkbox', envKey: 'SEARCH_HYBRID', advanced: true, defaultValue: false, helpText: 'combine vector + keyword' },
    { id: 'rerankResults', label: 'SEARCH_RERANK', type: 'checkbox', envKey: 'SEARCH_RERANK', advanced: true, defaultValue: false, helpText: 'second-pass scoring' },
  ],

  envSnippet: (cfg) => `# Similarity search
SEARCH_TOP_K=${get(cfg, 'search', 'topK', 5)}
SEARCH_THRESHOLD=${get(cfg, 'search', 'similarityThreshold', 0.2)}
SEARCH_HYBRID=${get(cfg, 'search', 'useHybridSearch', false)}
SEARCH_RERANK=${get(cfg, 'search', 'rerankResults', false)}`,

  hasCodePreview: true,
  codeSnippet: {
    filename: 'search.service.ts',
    language: 'typescript',
    code: `export class SearchService {
  async searchSimilar(query: string, limit = +process.env.SEARCH_TOP_K!) {
    const queryEmbedding = await embeddingService.generate(query);
    const results = await db.$queryRaw\`
      SELECT id, content, embedding <=> \${queryEmbedding}::vector AS distance
      FROM chunks
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> \${queryEmbedding}::vector
      LIMIT \${limit}
    \`;
    return results;
  }
}`,
    explanation: 'wizard.steps.search.codeExplanation',
  },

  canProceed: () => true,
};

export const step6: WizardStep = {
  id: 'rag',
  order: 6,
  title: 'wizard.steps.rag.title',
  subtitle: 'wizard.steps.rag.subtitle',
  icon: 'i-heroicons-sparkles',

  whatWeAreBbuilding: 'wizard.steps.rag.what',
  whyWeNeedThis: 'wizard.steps.rag.why',
  keyBenefits: ['wizard.steps.rag.benefits.0', 'wizard.steps.rag.benefits.1', 'wizard.steps.rag.benefits.2', 'wizard.steps.rag.benefits.3'],

  configFields: [
    { id: 'temperature', label: 'RAG_TEMPERATURE', type: 'slider', envKey: 'RAG_TEMPERATURE', defaultValue: 0.3, min: 0, max: 2, step: 0.1 },
    { id: 'citationsEnabled', label: 'RAG_CITATIONS', type: 'checkbox', envKey: 'RAG_CITATIONS', defaultValue: true, helpText: 'attach sources to answer' },
    {
      id: 'systemPromptTemplate',
      label: 'RAG_SYSTEM_PROMPT',
      type: 'textarea',
      envKey: 'RAG_SYSTEM_PROMPT',
      advanced: true,
      rows: 5,
      defaultValue: 'You are a helpful assistant. Answer based ONLY on the provided context. If the context is insufficient, say so.',
    },
    { id: 'maxContextTokens', label: 'RAG_MAX_CONTEXT', type: 'number', envKey: 'RAG_MAX_CONTEXT', advanced: true, defaultValue: 4096, min: 512, max: 32000, step: 512 },
    {
      id: 'responseLanguage',
      label: 'RAG_RESPONSE_LANG',
      type: 'select',
      envKey: 'RAG_RESPONSE_LANG',
      advanced: true,
      defaultValue: 'auto',
      options: [
        { value: 'auto', label: 'auto (match query)' },
        { value: 'en', label: 'english' },
        { value: 'es', label: 'español' },
      ],
    },
  ],

  envSnippet: (cfg) => `# RAG generation
RAG_TEMPERATURE=${get(cfg, 'rag', 'temperature', 0.3)}
RAG_CITATIONS=${get(cfg, 'rag', 'citationsEnabled', true)}
RAG_MAX_CONTEXT=${get(cfg, 'rag', 'maxContextTokens', 4096)}
RAG_RESPONSE_LANG=${get(cfg, 'rag', 'responseLanguage', 'auto')}
RAG_SYSTEM_PROMPT="${get(cfg, 'rag', 'systemPromptTemplate', '').replace(/"/g, '\\"')}"`,

  hasCodePreview: true,
  codeSnippet: {
    filename: 'rag.service.ts',
    language: 'typescript',
    code: `export class RAGService {
  async query(question: string) {
    const relevantChunks = await searchService.searchSimilar(question);
    const context = relevantChunks
      .map((c, i) => \`[Source \${i + 1}]: \${c.content}\`)
      .join('\\n\\n');
    const prompt = \`Context:\\n\${context}\\n\\nQuestion: \${question}\\n\\nAnswer:\`;
    const answer = await ollamaService.generate(prompt);
    return { answer, sources: relevantChunks };
  }
}`,
    explanation: 'wizard.steps.rag.codeExplanation',
  },

  canProceed: () => true,
};

export const wizardSteps: WizardStep[] = [step1, step2, step3, step4, step5, step6];

/**
 * Build the full multi-section .env from the wizard config.
 */
export function buildEnvFile(config: WizardConfig): string {
  return wizardSteps
    .map((s) => s.envSnippet?.(config))
    .filter(Boolean)
    .join('\n\n');
}
