# From Zero RAG

A production-ready full-stack application for **Retrieval-Augmented Generation (RAG)** built as a single Nuxt 3 project. Includes a RAG chat interface, document management, and an interactive learning quest — all in one app.

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
- **Agent Planner** — automatically routes queries to KB or direct reply
- **Memory Commands** — `/remember`, `/forget`, `/memory clear`

### Document Management
- **Multi-format** — Text, Markdown, PDF upload
- **Smart Chunking** — 800-char chunks with 100-char overlap
- **Multi-provider Embeddings** — Google Gemini (free) > OpenAI > Ollama
- **Reprocessing** — update embeddings on demand

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
│  ├── /           ├── documents/          │
│  ├── /documents  ├── search/             │
│  ├── /upload     ├── agent/              │
│  └── /learn/*    └── admin/              │
│                                          │
│  server/utils/                           │
│  ├── prisma.ts (pgvector)                │
│  ├── embedding.ts (Gemini/OpenAI/Ollama) │
│  ├── chunking.ts                         │
│  ├── documents.service.ts                │
│  ├── search.service.ts                   │
│  └── agent.service.ts                    │
└──────────────────────────────────────────┘
         │                    │
         ▼                    ▼
  PostgreSQL + pgvector    Ollama / Cloud LLM
```

### RAG Pipeline

```
INGESTION
  Upload → Chunk (800 chars) → Embed (768 dims) → Store (pgvector)

RETRIEVAL
  Query → Embed → Cosine Search → Top-K Chunks

GENERATION
  Chunks + Query → LLM (Ollama) → Response + Sources
```

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
| LLM | Ollama (local or cloud) |
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
cp .env.docker .env
# Edit .env — set GOOGLE_API_KEY or OLLAMA_API_KEY + OLLAMA_URL at minimum
# (.env.docker sets COMPOSE_PROFILES=full so profiled services start by default.)

# 3. Start (app + postgres + ollama)
docker compose --profile full up -d --build
# Equivalent after copying .env: docker compose up -d --build

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
cp .env.docker .env
# Edit .env — set DATABASE_URL and at least GOOGLE_API_KEY

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

---

### Environment Variables

Copy `.env.docker` to `.env` and fill in:

```env
# Database
DATABASE_URL=postgresql://rag:rag_password@localhost:5432/rag_db

# Embedding provider — pick one (Google is free)
GOOGLE_API_KEY=your_key       # https://aistudio.google.com/app/apikey
OPENAI_API_KEY=your_key       # fallback if Google not set

# LLM (Ollama local or cloud)
OLLAMA_URL=http://localhost:11434   # local
# OLLAMA_URL=https://ollama.com    # cloud
# OLLAMA_API_KEY=your_key          # cloud only
OLLAMA_LLM_MODEL=tinyllama

# Embedding model (used when Google/OpenAI not set)
OLLAMA_MODEL=nomic-embed-text

# Memory
MEMORY_SCOPE=local_per_user   # local_per_user | global | disabled
MEMORY_PROACTIVE=true
```

---

## API Reference

All endpoints are under `/api/` (same origin, no CORS needed).

### Documents

```http
GET    /api/documents               # list documents
POST   /api/documents               # create from text/markdown
POST   /api/documents/upload        # upload PDF/TXT/MD (multipart, max 10MB)
GET    /api/documents/:id           # get document + chunks
DELETE /api/documents/:id           # delete document
POST   /api/documents/:id/reprocess # re-embed document
```

### Search

```http
POST /api/search         # semantic vector search
POST /api/search/rag     # RAG query (search + LLM response)
POST /api/search/converse  # multi-turn chat with history
POST /api/search/inspect   # embedding debug + latency info
```

### Agent

```http
POST /api/agent/chat     # agentic chat with planner + memory
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
    │   ├── documents/
    │   ├── search/
    │   ├── agent/
    │   └── admin/
    ├── utils/              # services + singletons
    │   ├── prisma.ts
    │   ├── embedding.ts
    │   ├── chunking.ts
    │   ├── ollama.ts
    │   ├── documents.service.ts
    │   ├── search.service.ts
    │   └── agent.service.ts
    └── plugins/
        └── prisma.ts       # disconnect on shutdown
```

---

## Documentation

- [Docker Guide](docs/DOCKER.md)
- [Contributing](CONTRIBUTING.md)
- [Architecture Notes](docs/architecture/core-rag-architecture.md)

---

## License

MIT — see [LICENSE](LICENSE).

---

**Built by [Alberto González](https://github.com/albegosu) to learn RAG architecture from scratch.**
