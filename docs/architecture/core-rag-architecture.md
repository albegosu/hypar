# Technical Architecture

From Zero RAG is a single Nuxt 3 application. The frontend (Vue 3) and the backend (Nitro/h3 server routes) run in the same process on port 3000. There is no separate API server.

---

## System Overview

```
┌──────────────────────────────────────────────────────┐
│                  Nuxt 3  (port 3000)                 │
│                                                      │
│  Vue 3 pages + components                            │
│  ├── /               RAG chat (streaming)            │
│  ├── /documents      Document management             │
│  ├── /upload         Async file upload               │
│  └── /learn/*        RAG Learning Quest              │
│                                                      │
│  Nitro server (h3)                                   │
│  └── server/api/                                     │
│      ├── chat.post.ts   streaming chat (AI SDK)      │
│      ├── documents/     CRUD + async file upload     │
│      ├── search/        vector search + RAG debug    │
│      └── admin/         stats + query log            │
│                                                      │
│  server/workflows/                                   │
│  └── ingest-document.ts  durable ingest (Workflow SDK)│
│                                                      │
│  server/utils/                                       │
│  ├── prisma.ts          Prisma singleton             │
│  ├── embedding.ts       AI SDK embed/embedMany       │
│  ├── chunking.ts        text splitting               │
│  ├── ollama.ts          URL normalisation helper     │
│  ├── documents.service.ts                            │
│  ├── search.service.ts                               │
│  └── agent.service.ts   AI SDK tools + streamText   │
└──────────────────────────────────────────────────────┘
          │                          │
          ▼                          ▼
  PostgreSQL + pgvector      Embedding / LLM providers
  (vector(768) columns)      Google Gemini / OpenAI / Ollama
```

---

## RAG Pipeline

### Ingestion (async, durable)

```
Upload (text / PDF / MD)
  → Text extraction (pdf-parse for PDFs)
  → createDocumentShell() — Prisma document row created, returns immediately
  → Workflow SDK job starts: ingestDocument(documentId, content)
       Step 1: Chunking — 800-char sliding window, 100-char overlap
       Step 2: Embeddings — 768-dim via AI SDK embedMany()
                            priority: Google Gemini → OpenAI → Ollama
                            LRU cache (256 entries) prevents re-computation
       Step 3: Persist — batch INSERT into Chunk table (pgvector)
  → Client polls GET /api/documents/:id/ingest-status?runId=... until 'completed'
```

Upload returns `{ documentId, runId, status: 'processing' }` immediately.
Reprocess works the same way: deletes old chunks, starts a new workflow run.

### Retrieval + Generation (streaming)

```
User message
  → /api/chat — agentStreamText()
  → AI SDK streamText() with searchKnowledgeBase tool definition
  → Model decides: call tool or reply directly
       If tool called:
         → rag(query) — embed query + pgvector cosine search
              SELECT ... ORDER BY embedding <=> $query LIMIT k
         → Returns context + sources to model
       → Model streams answer token-by-token
  → UIMessageStream sent to browser (@ai-sdk/vue Chat class)
  → Sources and retrieved chunks shown in chat UI
```

### Agent Tool Definition

`buildKbTools()` in `server/utils/agent.service.ts` defines one tool:

```typescript
searchKnowledgeBase: tool({
  description: "Search the user's uploaded documents and personal memory...",
  inputSchema: z.object({ query: z.string().min(1) }),
  execute: async ({ query }) => rag(query, limit, userId),
})
```

The model calls this whenever the answer might depend on uploaded files or memories.
Memory commands (`/remember`, `/forget`, `/memory clear`) short-circuit before the tool call.

---

## Database Schema

```sql
-- Documents
CREATE TABLE documents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  source_type  VARCHAR(50),   -- 'text' | 'markdown' | 'pdf'
  user_id      TEXT,
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

-- Chunks (with vectors)
CREATE TABLE chunks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id  UUID REFERENCES documents(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  embedding    vector(768),
  chunk_index  INT,
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);

-- Query log
CREATE TABLE queries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text    TEXT NOT NULL,
  response_text TEXT,
  results       JSONB,
  latency_ms    INT,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON queries (created_at DESC);
```

---

## Embedding Providers

Priority order (first configured wins):

| Provider | Env var | Model | Notes |
|---|---|---|---|
| Google Gemini | `GOOGLE_API_KEY` | `gemini-embedding-001` | Free tier: 10M tokens/min |
| OpenAI | `OPENAI_API_KEY` | `text-embedding-3-small` | Paid |
| Ollama | `OLLAMA_URL` + `OLLAMA_MODEL` | `nomic-embed-text` | Local or cloud (OpenAI-compat) |

All providers output 768-dim vectors via the AI SDK (`embed` / `embedMany`). `EMBEDDING_DIMENSIONS` must match the pgvector column.

Ollama is accessed via `@ai-sdk/openai` pointed at `OLLAMA_URL/v1` — no separate Ollama npm client.

---

## API Endpoints

### Chat
```
POST /api/chat            body: { messages, userId?, limit? }
                          Returns: UIMessageStream (token-by-token)
```

### Documents
```
GET    /api/documents
POST   /api/documents               body: { title, content, sourceType }
POST   /api/documents/upload        multipart/form-data, max 10MB
                                    returns: { documentId, runId, status: 'processing' }
GET    /api/documents/:id
DELETE /api/documents/:id
POST   /api/documents/:id/reprocess returns: { runId, status: 'processing' }
GET    /api/documents/:id/ingest-status?runId=...
                                    returns: { runId, status, chunkCount }
```

### Search
```
POST /api/search          body: { query, limit?, userId? }
POST /api/search/rag      body: { query, limit?, userId? }
POST /api/search/inspect  body: { query }
```

### Admin
```
GET /api/admin/stats      (optional auth: Authorization: Bearer <ADMIN_API_KEY>)
GET /api/admin/queries    ?limit=50&offset=0
```

---

## Memory System

`MEMORY_SCOPE` controls how chat memories are scoped:

| Value | Behavior |
|---|---|
| `local_per_user` | memories are scoped to `userId`, isolated per user |
| `global` | all users share the same memory pool |
| `disabled` | memory commands and proactive saving are off |

Memories are stored as `Document` rows with `metadata.kind = 'chat_memory'`.

---

## Workflow SDK

Document ingestion uses the [Vercel Workflow SDK](https://github.com/vercel/workflow-js) for durability:

- Each step (chunk / embed / persist) is retried independently on failure
- State is written to `WORKFLOW_LOCAL_DATA_DIR` (file-based, no external queue needed)
- `server/plugins/workflow-init.ts` creates the directory on server startup
- Upload and reprocess both return a `runId` immediately; poll `ingest-status` for completion

---

## Performance

- **Embedding LRU cache** (256 entries) — avoids re-computing identical texts
- **HNSW index** — sub-linear approximate nearest-neighbor search at scale
- **Prisma `globalThis` singleton** — prevents connection pool exhaustion during HMR in dev
- **Streaming responses** — `streamText().toUIMessageStreamResponse()` pipes tokens as they arrive

---

## Security Notes

- File uploads are validated for MIME type and capped at 10MB in `server/api/documents/upload.post.ts`
- All route inputs are validated with zod schemas (`readValidatedBody`)
- Secrets are read via `useRuntimeConfig()` — never from `process.env` directly in route handlers
- Admin endpoints check `Authorization: Bearer <ADMIN_API_KEY>` when `ADMIN_API_KEY` is set
- No CORS configuration needed (same-origin)

---

*Last updated: 2026-05-02*
