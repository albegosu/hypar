# RAG pipeline

From Zero RAG implements **retrieval-augmented generation** as one Nuxt 3 app: Vue pages, Nitro `/api/*` routes, Prisma + pgvector, and the Vercel AI SDK for embeddings, tool-calling, and streaming chat.

This page describes the **end-to-end flow** from documents to answers. For hybrid retrieval details, see [Hybrid search & HyDE](./search). For chat memory commands, see [Memory & commands](./memory).

---

## 1. Ingestion (documents → chunks → vectors)

### Entry points

| Action | API | What happens |
| --- | --- | --- |
| Create from text | `POST /api/documents` | Body: `title`, `content`, `sourceType` (`text` \| `markdown`), optional `userId`, `metadata`. Starts async ingest. |
| Upload file | `POST /api/documents/upload` | Multipart PDF / TXT / MD (MIME-validated, size-capped). Text extracted, then same pipeline. |
| Re-embed | `POST /api/documents/:id/reprocess` | Deletes existing chunks for the document and runs ingest again. |

Successful creation returns identifiers so the UI can **poll** ingest status (see [API reference](/api/reference#documents)).

### Chunking

`server/utils/chunking.ts` splits plain text with **tiktoken** (`cl100k_base`):

- Default **~400 tokens** per chunk  
- **60-token overlap** between consecutive chunks  
- Each chunk records `startChar` / `endChar` / `tokenCount` for citations and debugging  

### Durable workflow

`server/workflows/ingest-document.ts` uses the **Workflow SDK** (`'use workflow'` / `'use step'`):

1. **`parseChunks`** — token-aware split (retryable step).  
2. **`embedChunksWithRetry`** — batch embeddings via `generateEmbeddings` (exponential backoff, up to 3 attempts).  
3. **`persistChunks`** — transactional delete of old chunks + insert new rows with `vector(768)` embeddings.  
4. **`markStatus`** — sets `Document.ingestStatus` to `ready` or `failed` and updates `chunkCount` / `ingestError`.

State is stored under `WORKFLOW_LOCAL_DATA_DIR` (see [Environment variables](/guide/env)).

### Embeddings provider order

`server/utils/embedding.ts` picks the first configured provider (typically **Google Gemini** → **OpenAI** → **Ollama**). Vector dimension must match the DB (`768` by default, `EMBEDDING_DIMENSIONS`).

---

## 2. Retrieval in chat (agent + tool)

### `POST /api/chat`

The handler validates a bounded list of **UIMessages** (AI SDK shape), resolves `userId` / `conversationId`, and either:

- Handles a **memory command** (`/remember`, `/forget`, `/memory clear`, `/help`) without calling the LLM tool path, or  
- Runs **`agentStreamText`** — `streamText` with a single tool, `searchKnowledgeBase`.

The tool’s `execute` function calls **`rag()`** in `server/utils/search.service.ts`, which:

1. Optionally runs **HyDE** (hypothetical answer → embed that text instead of the raw query) when a language model is passed in.  
2. Runs **hybrid search** (dense vector + BM25) with **MMR** diversification and a **minimum score** floor.  
3. Returns ranked passages; the model streams an answer and cites `[1]`, `[2]`, …

Retrieved chunks for the turn are collected in a **bucket** so the server can persist **`Message.sources`** after the stream finishes.

### Conversations & persistence

- **`Conversation`** / **`Message`** models store multi-turn history and assistant **`sources`** (JSON) for reload and audit.  
- **`Query`** logs text, optional `toolCalled`, latency, and serialized sources for analytics.

---

## 3. Design choices (short)

| Topic | Choice |
| --- | --- |
| Same-origin API | No CORS; cookies and relative `/api` from the Nuxt app. |
| Streaming | UIMessage stream for low time-to-first-token. |
| Citations | Numeric labels aligned with the order of passages returned to the model. |
| Ingest errors | Document moves to `failed` with `ingestError`; chunks are not left half-updated across the transaction. |

---

## Next

- [Hybrid search & HyDE →](./search)  
- [Memory & commands →](./memory)  
- [API reference →](/api/reference)  
- [Architecture overview →](/architecture/)
