# Architecture

hypar is a **single Nuxt 3 application**: Vue 3 on the client, **Nitro** (`h3`) server routes on the same port, **Prisma** + **PostgreSQL/pgvector** for persistence, and the **Vercel AI SDK** for embeddings, streaming chat, and tool execution.

There is **no separate Node API repo** and no CORS split — the UI calls relative `/api/*` routes.

---

## High-level diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Vue 3)                        │
│  pages/*  components/*  Pinia stores  @ai-sdk/vue chat      │
└──────────────────────────┬────────────────────────────────┘
                           │ same origin
┌──────────────────────────▼────────────────────────────────┐
│                  Nitro server (Nuxt)                      │
│  server/api/*          — REST + streaming                 │
│  server/utils/*        — services (search, agent, docs)   │
│  server/workflows/*    — durable ingest (Workflow SDK)  │
│  server/middleware/*   — rate limits, etc.                │
└───────────────┬───────────────────────┬───────────────────┘
                │                       │
                ▼                       ▼
        PostgreSQL 16              Provider HTTP
        + pgvector                 (Gemini / OpenAI / Ollama)
```

---

## Layer responsibilities

| Layer | Path / module | Responsibility |
| --- | --- | --- |
| UI | `pages/`, `components/`, `layouts/` | Chat, documents, upload, `/learn` shell. |
| API | `server/api/**/*.ts` | Validation, orchestration, HTTP status codes. |
| Domain | `server/utils/*.service.ts`, `chunking.ts`, `embedding.ts` | RAG logic, Prisma queries, agent + tools. |
| Background | `server/workflows/ingest-document.ts` | Chunk → embed → persist with retries. |
| Data | `prisma/schema.prisma` | `Document`, `Chunk`, `Conversation`, `Message`, `Query`. |

---

## Key data models (conceptual)

- **`Document`** — source file or note; `ingestStatus`, `chunkCount`, optional `userId` for per-user memories.  
- **`Chunk`** — text segment + `vector(768)` + optional char offsets for citations.  
- **`Conversation` / `Message`** — persisted chat with optional `sources` on assistant rows.  
- **`Query`** — analytics / audit log for retrieval + responses.

Indexes include **HNSW** on embeddings (see migrations) and full-text **`textsearch`** on chunks for hybrid retrieval.

---

## Deeper reading

| Doc | Contents |
| --- | --- |
| [Technical architecture (deep dive)](./core-rag-architecture) | Historical narrative, tool definition sketch, embedding table, security notes. |
| [Project structure](./project-structure) | Directory tour and file naming conventions. |

When the deep-dive doc disagrees with **current code** (chunk sizes, exact SQL), **trust the repository** — the [RAG pipeline](/features/rag-pipeline) and [Search](/features/search) feature pages are kept aligned with implementation.

---

## Deployment shape

- **Development:** `docker compose --profile full` runs app + Postgres + Ollama (see [Docker guide](/guide/docker)).  
- **Production:** see [Production deployment](/guide/production) and root `docker-compose.prod.yml` / Caddy notes in [DOCKER.md](../DOCKER.md).

---

## Next

- [API reference →](/api/reference)  
- [Features overview →](/features/rag-pipeline)  
- [Contributing →](/contributing)
