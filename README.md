# fragua

A production-ready full-stack application for **Retrieval-Augmented Generation (RAG)** built as a single Nuxt 3 project. Includes a RAG chat interface, document management, and an interactive learning quest — all in one app.

![Banner](<img width="1799" height="950" alt="Screenshot 2026-05-03 at 23 48 15" src="https://github.com/user-attachments/assets/a2125d39-9f24-498c-b84e-b19ca6fbe45d"/>)
<br>
[![Docker Build](https://github.com/albegosu/from-zero-rag/actions/workflows/docker-build.yml/badge.svg)](https://github.com/albegosu/from-zero-rag/actions/workflows/docker-build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Nuxt](https://img.shields.io/badge/Nuxt-3-green)](https://nuxt.com/)
[![pgvector](https://img.shields.io/badge/pgvector-0.5-purple)](https://github.com/pgvector/pgvector)

---

## Features

### RAG Chat & Search
- **Semantic Search** — vector similarity search with pgvector
- **RAG Mode** — context-aware AI responses with source citations
- **Conversational AI** — multi-turn dialogue with per-user memory
- **Agentic Chat** — AI SDK tool-calling routes queries to KB or replies directly; token-by-token streaming
- **Memory Commands** — `/remember`, `/forget`, `/memory clear`

### Document Management
- **Multi-format** — Text, Markdown, PDF upload (MIME-validated, 10 MB limit)
- **Token-aware Chunking** — ~400 tokens per chunk, 60-token overlap (`js-tiktoken` cl100k_base)
- **Multi-provider Embeddings** — Google Gemini (free) > OpenAI > Ollama
- **Async ingestion** — durable workflow + transactional persistence + retries on embed failures
- **Visible status** — every document has `pending`/`processing`/`ready`/`failed` + `chunkCount`
- **Reprocessing** — update embeddings on demand

### Retrieval quality
- **Hybrid search** — pgvector cosine similarity combined with PostgreSQL BM25 (`ts_rank_cd`); names, codes, and literals embeddings often miss still surface via keywords
- **HyDE (optional)** — hypothetical-document embedding: the LLM drafts a short answer, that text is embedded as the query, improving recall on factual Q&A (extra LLM call when enabled)
- **MMR re-ranking** — over-fetch K×3 then diversify with Maximal Marginal Relevance
- **Score threshold** — drop matches below 0.2 cosine similarity
- **Source citations** — `[1]`, `[2]` aligned with returned passages, persisted on every assistant message
- **Per-user memory scope** — chat memories are user-scoped; uploads are global

### Persistence & history
- **Conversations + Messages tables** — chat history survives reloads, browser closes, devices
- **Audit trail** — every query logs which chunks were retrieved (`Query.sources`, `Query.toolCalled`)

### Safety & ops
- **Rate-limit middleware** — chat 30/min, upload 10/min per (IP+userId)
- **Admin auth** — endpoints return 401 unconditionally if `ADMIN_API_KEY` is not set
- **Strict input validation** — Zod schemas + 64KB/part chat message cap
- **Eval harness** — `pnpm eval` reports hit-rate, MRR, p50/p95 latency over `evals/golden.jsonl`
- **Tests** — `pnpm test` (vitest) covers chunking, text utils, agent commands

### RAG Learning Quest (`/learn`)
- **3 Levels** — Embeddings, Chunking, Vector Database
- **9 Coding Challenges** — easy → hard, 650 XP total
- **Live Code Editor** — Monaco Editor with instant validation
- **Progress Tracking** — XP, badges, persisted state

---

## Architecture

Everything runs as a **single Nuxt 3 app** on port 3000. The frontend and backend share the same process — no CORS, no separate API server.

```
┌──────────────────────────────────────────┐
│            Nuxt 3  (port 3000)           │
│                                          │
│  pages/          server/api/             │
│  ├── /           ├── chat.post.ts        │
│  ├── /documents  ├── documents/          │
│  ├── /upload     ├── search/             │
│  └── /learn/*    └── admin/              │
│                                          │
│  server/utils/                           │
│  ├── prisma.ts (pgvector)                │
│  ├── embedding.ts (AI SDK providers)     │
│  ├── chunking.ts                         │
│  ├── documents.service.ts                │
│  ├── search.service.ts                   │
│  └── agent.service.ts (AI SDK tools)     │
│                                          │
│  server/workflows/                       │
│  └── ingest-document.ts (Workflow SDK)   │
└──────────────────────────────────────────┘
         │                    │
         ▼                    ▼
  PostgreSQL + pgvector    Ollama / Cloud LLM
```

### RAG Pipeline

```
INGESTION (async, durable, transactional)
  Upload → Workflow SDK job:
    parseChunks (≈400 tokens, 60 overlap)
    → embedChunks (3 retries, exp. backoff)
    → persistChunks (one transaction, cascades on failure)
    → markStatus (Document.ingestStatus = ready | failed)
  Returns runId immediately; poll /api/documents/:id/ingest-status

RETRIEVAL
  Query → embed → pgvector cosine ANN (HNSW) → fetch K×3
        → drop < minScore (0.2)
        → MMR diversify (λ=0.7)
        → top K

GENERATION (streaming)
  AI SDK tool call: searchKnowledgeBase →
    chunks accumulated in a per-request bucket →
    streamText with citation instructions →
    onFinish: persist Message + Query.sources for audit
```

### Recommended models

The default (`OLLAMA_LLM_MODEL=tinyllama`) keeps the stack runnable on a laptop
but **does not reliably tool-call** — the agent will often answer without ever
querying the knowledge base. For a useful experience switch to a model that
supports tool calling:

```bash
# In .env
OLLAMA_LLM_MODEL=qwen2.5:7b-instruct  # or llama3.1:8b
```

Embeddings (`nomic-embed-text`, 768 dims) work well as-is.

### Admin endpoints

`/api/admin/stats` and `/api/admin/queries` are **disabled by default**. To
enable them set `ADMIN_API_KEY` in `.env` and pass it as
`Authorization: Bearer <key>` (or `x-admin-key: <key>`). With the key unset
both endpoints return 401 — they will never be silently public.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 3 (Vue 3 + Nitro/h3) |
| UI | Nuxt UI v3 + Tailwind CSS v4 |
| State | Pinia |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| Database | PostgreSQL 16 + pgvector |
| Embeddings | Google Gemini / OpenAI / Ollama |
| LLM | Ollama (local or cloud) — via OpenAI-compat endpoint |
| LLM / Chat SDK | Vercel AI SDK (`ai`, `@ai-sdk/vue`, `@ai-sdk/google`, `@ai-sdk/openai`) |
| Ingestion | Vercel Workflow SDK (`workflow`) — durable, per-step retries |
| Code Editor | Monaco Editor (learning only) |
| Runtime | Node.js 20 |

---

## Quick Start

### Prerequisites

- **Docker 20.10+** and **Docker Compose 2.0+**
- OR **Node.js 20+** and **pnpm 10+** for local dev
- A PostgreSQL instance with pgvector (the Docker setup includes one)
- At least one API key: [Google AI Studio](https://aistudio.google.com/app/apikey) (free, recommended) or OpenAI

---

### Option 1: Docker (recommended)

```bash
# 1. Clone
git clone https://github.com/albegosu/from-zero-rag.git
cd from-zero-rag

# 2. Configure
cp .env.example .env
# Edit .env — set GOOGLE_API_KEY or OLLAMA_API_KEY + OLLAMA_URL at minimum
# Optional: uncomment COMPOSE_PROFILES=full in .env so `docker compose up -d --build`
# starts app + postgres + ollama without passing --profile each time.

# 3. Start (app + postgres + ollama)
docker compose --profile full up -d --build

# 4. Open
open http://localhost:3000
```

**Profiles:**

| Profile | Services |
|---|---|
| `full` | app + postgres + ollama |
| `api` | postgres + ollama only (no app) |
| `all` | same as `full` |

**Stop:**
```bash
docker compose --profile full down
```

---

### Option 2: Local Development

```bash
# 1. Clone & install
git clone https://github.com/albegosu/from-zero-rag.git
cd from-zero-rag
pnpm install

# 2. Configure
cp .env.example .env
# Edit .env — set DATABASE_URL (see comments in .env.example) and at least GOOGLE_API_KEY

# 3. Run database migrations
pnpm db:migrate

# 4. Start dev server
pnpm dev
```

Open http://localhost:3000.

**Useful scripts:**

| Script | Description |
|---|---|
| `pnpm dev` | Start dev server with HMR |
| `pnpm build` | Production build |
| `pnpm start` | Run production build |
| `pnpm db:migrate` | Run Prisma migrations (dev) |
| `pnpm db:deploy` | Run migrations (production) |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm test` | Vitest (chunking, text utils, agent commands) |
| `pnpm eval` | RAG eval harness (`evals/golden.jsonl`) |

---

### Environment variables

Copy [`.env.example`](.env.example) to `.env` and follow the comments inside. It is the **single tracked template** for Docker and local dev. Common additions for `pnpm dev` against Docker Postgres:

```env
DATABASE_URL=postgresql://rag:rag_password@localhost:5432/rag_db
OLLAMA_URL=http://localhost:11434
WORKFLOW_LOCAL_DATA_DIR=./data/workflow
```

With **Docker**, the compose file injects `DATABASE_URL` into the app container; you mainly need an embedding key (`GOOGLE_API_KEY` or `OPENAI_API_KEY`) or Ollama configured. The app runs `prisma migrate deploy` on container startup — no manual migration step for the full stack in Docker.

---

## API Reference

All endpoints are under `/api/` (same origin, no CORS needed).

### Documents

```http
GET    /api/documents                         # list documents
POST   /api/documents                         # create from text/markdown
POST   /api/documents/upload                  # upload PDF/TXT/MD (multipart, max 10MB)
                                              # returns { documentId, runId, status: 'processing' }
GET    /api/documents/:id                     # get document + chunks
DELETE /api/documents/:id                     # delete document
POST   /api/documents/:id/reprocess           # re-embed (async) — returns { runId, status: 'processing' }
GET    /api/documents/:id/ingest-status?runId # poll workflow run status
```

### Chat (streaming)

```http
POST /api/chat           # streaming agentic chat (AI SDK UIMessageStream)
                         # body: { messages, userId?, limit? }
```

### Search

```http
POST /api/search         # semantic vector search
POST /api/search/rag     # RAG query (search only, no LLM)
POST /api/search/inspect # embedding debug + latency info
```

### Admin

```http
GET /api/admin/stats     # document/chunk/query counts
GET /api/admin/queries   # recent query log
```

---

## Project Structure

```
from-zero-rag/
├── nuxt.config.ts          # modules, runtimeConfig
├── app.vue / app.config.ts
├── prisma/
│   ├── schema.prisma       # Document, Chunk, Query models
│   └── migrations/
├── assets/css/main.css     # Tailwind v4 + theme tokens
├── pages/
│   ├── index.vue           # RAG chat
│   ├── upload.vue
│   ├── documents/
│   └── learn/              # Learning Quest (/learn/*)
├── components/
│   ├── AppHeader.vue
│   ├── BottomNav.vue
│   └── learn/              # auto-prefixed <Learn*>
├── layouts/
│   ├── default.vue         # RAG shell
│   └── learn.vue           # Learning shell
├── stores/
│   ├── documents.ts
│   └── progress.ts         # Learning XP/badges
├── utils/learning/         # inlined learning library
│   ├── levels/
│   ├── validators/
│   └── wizard/
└── server/
    ├── api/                # h3 route handlers
    │   ├── chat.post.ts    # streaming agentic chat (AI SDK)
    │   ├── documents/
    │   ├── search/
    │   └── admin/
    ├── workflows/
    │   └── ingest-document.ts  # durable ingest (Workflow SDK)
    ├── utils/              # services + singletons
    │   ├── prisma.ts
    │   ├── embedding.ts    # AI SDK embed/embedMany (Google/OpenAI/Ollama)
    │   ├── chunking.ts
    │   ├── ollama.ts       # URL normalisation helper
    │   ├── documents.service.ts
    │   ├── search.service.ts
    │   └── agent.service.ts    # AI SDK streamText + tool definitions
    └── plugins/
        ├── prisma.ts       # disconnect on shutdown
        └── workflow-init.ts # mkdir WORKFLOW_LOCAL_DATA_DIR on boot
```

---

## Documentation

- [Getting Started (VitePress)](docs/guide/getting-started.md) — same flow as this README; use `.env.example` as the env template
- [Docker Guide](docs/DOCKER.md)
- [Contributing](CONTRIBUTING.md)
- [Architecture Notes](docs/architecture/core-rag-architecture.md)

---

## License

MIT — see [LICENSE](LICENSE).

---

**Built by [Alberto González](https://github.com/albegosu) to learn RAG architecture from scratch.**
