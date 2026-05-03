# Project Structure

## Root

```
Dockerfile                   Multi-stage image: builder (pnpm build) → runner (node)
docker-compose.yml           Development stack: app + postgres + ollama
docker-compose.prod.yml      Production stack: adds Caddy as reverse proxy
docker-entrypoint.sh         Container startup script (prisma migrate deploy + start)
Caddyfile                    Caddy configuration (TLS, reverse proxy to port 3000)
nuxt.config.ts               Nuxt config: modules, runtimeConfig, i18n, workflow
app.config.ts                Nuxt UI config (@nuxt/ui theme tokens)
app.vue                      SPA root component
tsconfig.json                TypeScript config (path aliases: ~/, @/)
vitest.config.ts             Unit test configuration
prisma.config.ts             Prisma 6+ CLI config (schema path and datasource)
```

---

## Frontend

### pages/
```
index.vue                    Main chat page (RAG agent + conversations + recent documents)
upload.vue                   Document upload (pasted text or PDF/txt/md file)
documents/index.vue          Document list with search
documents/[id].vue           Document detail: chunks, re-chunking, deletion
learn/index.vue              Level map for the learning mode
learn/onboarding.vue         RAG stack setup wizard (.env generator)
learn/level/[id].vue         Level detail with its challenges
learn/challenge/[id].vue     Individual challenge: code editor + validation
```

### layouts/
```
default.vue                  Main layout: AppHeader + main + BottomNav
learn.vue                    Learn mode layout (no bottom nav, sidebar)
```

### components/
```
AppHeader.vue                Sticky header: logo, nav, theme toggle
BottomNav.vue                Fixed bottom navigation (mobile)
learn/LevelMap.vue           Visual level map with progress
learn/WizardConfigField.vue  Single wizard field (input, select, toggle)
learn/WizardConfigForm.vue   Full RAG config wizard form
```

### composables/
```
useUserId.ts                 Anonymous user ID (localStorage, generates UUID if absent)
useTerminalPrefs.ts          Theme preferences (light/dark, persisted in localStorage)
useConfigRepository.ts       RAG wizard configuration repository (localStorage)
```

### stores/ (Pinia)
```
documents.ts                 User document list, fetch, loading state
progress.ts                  User progress through learn mode challenges
```

### plugins/
```
i18n.ts                      Initialises vue-i18n with en/es locales
```

### assets/
```
css/main.css                 Terminal theme CSS variables (colours, glass, scanline, etc.)
```

### i18n/
```
locales/en.json              English translations
locales/es.json              Spanish translations
```

### utils/learning/
Complete learning mode system. Does not affect the production RAG pipeline.
```
levels/level-1-embeddings.ts   Level 1 definition: embedding challenges
levels/level-2-chunking.ts     Level 2 definition: chunking challenges
levels/level-3-vector-db.ts    Level 3 definition: vector DB challenges
validators/                    Per-challenge validators (check the user's solution)
wizard/wizard-steps.ts         Onboarding wizard steps
wizard/providers.catalog.ts    Provider catalogue (Ollama, OpenAI, Gemini, etc.)
types/index.ts                 Shared types for the learning system
```

---

## Server (Nitro / Nuxt)

### server/api/
```
chat.post.ts                 Main chat endpoint
                             → validates body, resolves conversation, runs agent or memory command
                             → responds with UIMessageStream (streaming SSE)

documents/index.get.ts       GET    /api/documents         list user documents
documents/index.post.ts      POST   /api/documents         create document from text
documents/upload.post.ts     POST   /api/documents/upload  file upload (multipart)
documents/[id].get.ts        GET    /api/documents/:id     detail + chunks
documents/[id].delete.ts     DELETE /api/documents/:id     delete document and its chunks
documents/[id]/reprocess.post.ts   POST reprocess          re-ingest existing document
documents/[id]/ingest-status.get.ts GET ingest-status      workflow ingestion status

conversations/index.get.ts   GET    /api/conversations          list user conversations
conversations/index.post.ts  POST   /api/conversations          create new conversation
conversations/[id].get.ts    GET    /api/conversations/:id      messages in a conversation
conversations/[id].delete.ts DELETE /api/conversations/:id      delete conversation

search/index.post.ts         POST /api/search          raw vector search (used by learn challenges)
search/inspect.post.ts       POST /api/search/inspect  search with latency metrics (debug)
search/rag.post.ts           POST /api/search/rag      search + formatted context (used by learn)

admin/stats.get.ts           GET  /api/admin/stats     global metrics (documents, queries)
admin/queries.get.ts         GET  /api/admin/queries   RAG query history
health.get.ts                GET  /api/health          Docker container healthcheck
```

### server/utils/
```
agent.service.ts             RAG agent:
                             - agentStreamText(): calls streamText with searchKnowledgeBase tool
                             - runMemoryCommand(): executes /remember, /forget, /memory clear

agent-commands.ts            Slash command parser (/remember, /forget, /help, /memory clear)

search.service.ts            Search engine:
                             - search(): hybrid vector (cosine) + BM25 with MMR diversification
                             - rag(): search() + formats numbered context for the prompt
                             - inspect(): debug version with latency metrics
                             - logRagQuery(): persists each query to the RagQuery table

documents.service.ts         Document business logic:
                             - createDocument() / deleteDocument()
                             - startIngestion(): launches async ingestion workflow
                             - createChatMemory() / deleteChatMemories(): user memories

conversations.service.ts     Conversation and message management in DB:
                             - ensureConversation(): creates or retrieves active conversation
                             - appendUserMessage() / appendAssistantMessage()
                             - refreshConversationTitleFromUserPrompt()

chunking.ts                  splitIntoChunks(): splits text into chunks with configurable overlap
embedding.ts                 generateEmbedding() / generateEmbeddings(): calls Ollama or provider
ollama.ts                    normalizeOllamaNativeHost(): normalises Ollama URLs
prisma.ts                    Prisma client singleton
text.ts                      Text utilities: truncate(), stripNul() (removes null bytes from PDFs)
errors.ts                    Helpers: notFound(), badRequest(), internalError()
admin-auth.ts                Verifies ADMIN_API_KEY on admin endpoint headers
```

### server/plugins/
Nitro plugins: run at server startup before handling requests.
```
prisma.ts                    Connects Prisma on startup and disconnects on shutdown
workflow-init.ts             Creates WORKFLOW_LOCAL_DATA_DIR; attempts to load steps.mjs
register-workflow-steps.ts   Docker production fix: registers the 4 workflow steps directly
                             in the bundle (without relying on the generated steps.mjs)
```

### server/workflows/
```
ingest-document.ts           Async document ingestion workflow:
                             - ingestDocument()       'use workflow' → orchestrates the 4 steps
                             - parseChunks()          'use step' → splitIntoChunks()
                             - embedChunksWithRetry() 'use step' → generateEmbeddings() with retry
                             - persistChunks()        'use step' → DELETE + INSERT into Chunk table
                             - markStatus()           'use step' → updates ingestStatus on Document
```

### server/middleware/
```
rate-limit.ts                Per-IP rate limiting (in-memory sliding window)
```

---

## Database (Prisma + pgvector)

### prisma/schema.prisma
```
Document      Uploaded document: title, content, type, userId, ingestStatus, chunkCount
Chunk         Document fragment: content, embedding (768-dim vector), textsearch (tsvector)
Conversation  Chat conversation: userId, title, timestamps
Message       Message within a conversation: role, content, parts (JSON), sources (JSON)
RagQuery      Audit of each RAG query: text, response, latency, retrieved chunks
```

### prisma/migrations/
```
20250424160000_init                  Initial tables + pgvector
20250424180000_embedding_dim_768     Vector dimension: 768 (nomic-embed-text)
20260425120000_query_createdat_index Index on RagQuery.createdAt
20260429100000_memory_userid         userId field on chat_memory documents
20260503120000_robustify_mvp         Conversations + Messages + ingestError/chunkCount fields
20260504000000_hybrid_search         textsearch (tsvector) field + GIN index for BM25
```

### init-scripts/
```
01-init.sql                  CREATE EXTENSION vector — runs before Prisma migrations
                             (Postgres init needs the extension before Prisma starts)
```

---

## Nuxt Modules

### modules/
```
copy-workflow-bundles.ts     Post-build: copies .nuxt/workflow/ → .output/server/workflow/
                             Required because the workflow runtime needs the bundles in production
```

---

## Tests

### tests/
```
chunking.spec.ts             Chunking algorithm tests (sizes, overlap, edge cases)
agent.spec.ts                Agent tests (parseMemoryCommand, message filtering)
search.spec.ts               Search engine tests (MMR, scoring, filters)
text.spec.ts                 Text utility tests (truncate, stripNul)
```

---

## CI/CD

### .github/workflows/
```
ci.yml                       Main pipeline: lint + typecheck + tests on every PR
test-backend.yml             Server tests with a real database (PostgreSQL + pgvector)
test-frontend.yml            Vue component tests
test-learning.yml            Learn mode validator tests
docker-build.yml             Build and push Docker image to registry
deploy.yml                   Automatic deploy on merge to main
release.yml                  Release and changelog generation
security.yml                 Dependency audit (npm audit)
```

---

## Operations

### scripts/
```
reingest-all.ts              Re-processes all existing documents
                             (useful after chunking or schema changes)
eval-rag.ts                  Evaluates RAG quality against the golden dataset
```

### evals/
```
golden.jsonl                 Evaluation dataset: questions + expected substring in the response
```

---

## Deployment

### Docker
```
.dockerignore                Excludes node_modules, .git, .nuxt, data/, etc. from build context
docker-entrypoint.sh         On startup: prisma migrate deploy → node server/index.mjs
```

### Environment variables (.env / docker-compose)
```
DATABASE_URL                 PostgreSQL connection string
OLLAMA_URL                   Ollama URL (embeddings + LLM)
OLLAMA_MODEL                 Embedding model (default: nomic-embed-text)
OLLAMA_LLM_MODEL             Chat model (default: llama3.1:8b)
EMBEDDING_DIMENSIONS         Vector dimensions (default: 768)
MEMORY_SCOPE                 local_per_user | global | disabled
ADMIN_API_KEY                Key for /api/admin/* endpoints
GOOGLE_API_KEY / OPENAI_API_KEY  Alternative embedding/LLM providers
```
