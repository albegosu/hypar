# Technical Architecture

From Zero RAG is a single Nuxt 3 application. The frontend (Vue 3) and the backend (Nitro/h3 server routes) run in the same process on port 3000. There is no separate API server.

---

## System Overview

```
┌──────────────────────────────────────────────────────┐
│                  Nuxt 3  (port 3000)                 │
│                                                      │
│  Vue 3 pages + components                            │
│  ├── /               RAG chat & search               │
│  ├── /documents      Document management             │
│  ├── /upload         File upload                     │
│  └── /learn/*        RAG Learning Quest              │
│                                                      │
│  Nitro server (h3)                                   │
│  └── server/api/                                     │
│      ├── documents/  CRUD + file upload              │
│      ├── search/     vector search + RAG             │
│      ├── agent/      planner-driven chat             │
│      └── admin/      stats + query log               │
│                                                      │
│  server/utils/                                       │
│  ├── prisma.ts        Prisma singleton               │
│  ├── embedding.ts     multi-provider embeddings      │
│  ├── chunking.ts      text splitting                 │
│  ├── ollama.ts        Ollama HTTP client             │
│  ├── documents.service.ts                            │
│  ├── search.service.ts                               │
│  └── agent.service.ts                               │
└──────────────────────────────────────────────────────┘
          │                          │
          ▼                          ▼
  PostgreSQL + pgvector      Embedding / LLM providers
  (vector(768) columns)      Google Gemini / OpenAI / Ollama
```

---

## RAG Pipeline

### Ingestion

```
Upload (text / PDF / MD)
  → Text extraction (pdf-parse for PDFs)
  → Chunking: 800-char sliding window, 100-char overlap
  → Embedding generation: 768-dim vector
       priority: Google Gemini → OpenAI → Ollama
       LRU cache (256 entries) prevents re-computation
  → Store: documents + chunks tables (pgvector)
```

### Retrieval + Generation

```
User query
  → Embed query (same model as documents)
  → pgvector cosine similarity search
       SELECT ... ORDER BY embedding <=> $query LIMIT k
  → Assemble context from top-K chunks
  → LLM generation (Ollama) with context in system prompt
  → Return answer + source citations
```

### Agent Planner

The `/api/agent/chat` endpoint adds a planning step before retrieval:

```
User message
  → Planner LLM call (JSON format):
       { use_kb: bool, search_query: string|null, direct_reply: string|null }
  → If use_kb=false  → return direct_reply immediately
  → If use_kb=true   → run RAG pipeline with search_query
```

Memory commands (`/remember`, `/forget`, `/memory clear`) are intercepted before the planner and handled directly.

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
| Ollama | `OLLAMA_URL` + `OLLAMA_MODEL` | `nomic-embed-text` | Local or cloud |

All providers output 768-dim vectors. `EMBEDDING_DIMENSIONS` must match the pgvector column.

---

## API Endpoints

### Documents
```
GET    /api/documents
POST   /api/documents               body: { title, content, sourceType }
POST   /api/documents/upload        multipart/form-data, max 10MB
GET    /api/documents/:id
DELETE /api/documents/:id
POST   /api/documents/:id/reprocess
```

### Search
```
POST /api/search          body: { query, limit?, userId? }
POST /api/search/rag      body: { query, limit?, userId? }
POST /api/search/converse body: { messages, userId? }
POST /api/search/inspect  body: { query }
```

### Agent
```
POST /api/agent/chat      body: { messages, userId?, limit? }
```

### Admin
```
GET /api/admin/stats      ?limit=10&offset=0
GET /api/admin/queries    ?limit=10&offset=0
```

---

## Memory System

`MEMORY_SCOPE` controls how chat memories are scoped:

| Value | Behavior |
|---|---|
| `local_per_user` | memories are scoped to `userId`, isolated per user |
| `global` | all users share the same memory pool |
| `disabled` | memory commands and proactive saving are off |

Memories are stored as `Document` rows with `sourceType = 'memory'`.

---

## Performance

- **Embedding LRU cache** (256 entries) — avoids re-computing identical texts
- **HNSW index** — sub-linear approximate nearest-neighbor search at scale
- **Prisma `globalThis` singleton** — prevents connection pool exhaustion during HMR in dev
- **Context truncation** — RAG context is capped at 20,000 chars before sending to the LLM

---

## Security Notes

- File uploads are validated for MIME type and capped at 10MB in `server/api/documents/upload.post.ts`
- All route inputs are validated with zod schemas (`readValidatedBody`)
- Secrets are read via `useRuntimeConfig()` — never from `process.env` directly in route handlers
- No CORS configuration needed (same-origin)

---

*Last updated: 2026-05-01*
