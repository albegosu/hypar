# API reference

All routes are **same-origin** Nitro handlers under **`/api/*`**. Request bodies use JSON unless noted. Validation is done with **Zod** (`readValidatedBody` / `getValidatedQuery`).

---

## Conventions

| Topic | Detail |
| --- | --- |
| Base URL | Same host as the Nuxt app (e.g. `http://localhost:3000`). |
| Errors | Typical `4xx` / `5xx` with JSON `{ statusMessage, message }` where applicable. |
| Admin auth | `GET/POST /api/admin/*` use `requireAdmin`: session with **`role === 'admin'`**, **or** `Authorization: Bearer <ADMIN_API_KEY>` / `x-admin-key` when `ADMIN_API_KEY` is set. |
| Rate limits | In-memory token bucket per **IP + session user id**: chat `POST /api/chat` **30/min**; `POST /api/documents/upload` **10/min**; other document `POST`/`DELETE` **30/min** (`server/middleware/rate-limit.ts`). Optional `REDIS_URL` for multi-instance (`server/utils/distributed-store.ts`). |

---

## Health

### `GET /api/health`

JSON status for load balancers: DB connectivity, embedding provider reachability, timestamp.

---

## Chat

### `POST /api/chat`

**Streaming** agentic chat (AI SDK **UIMessage** stream).

**Body (JSON)**

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `messages` | array | yes | 1–50 UIMessage-shaped objects (`role`, `parts`, optional `id`). |
| `userId` | string | no | Max 200 chars; scopes memory + retrieval. |
| `conversationId` | string (uuid) | no | Continue an existing thread. |
| `limit` | number | no | Retrieval `limit` for the KB tool (1–20, implementation default if omitted). |

Text parts are capped at **64 KiB** each.

**Response:** `UIMessageStream` (not plain JSON).

**Side effects:** appends user + assistant messages, may create/refine conversation title, logs a **`Query`** row on completion.

---

## Conversations

### `GET /api/conversations`

**Query:** optional `userId`.

**Response:** `{ items: ConversationSummary[] }`.

### `POST /api/conversations`

**Body:** optional `userId`, optional `title`.

**Response:** `{ id }` — new conversation UUID.

### `GET /api/conversations/:id`

**Query:** optional `userId` (access check).

**Response:** conversation with messages (shape from `getConversation`).

### `DELETE /api/conversations/:id`

Deletes the conversation and cascaded messages.

---

## Documents

### `GET /api/documents`

List documents (service-defined filters / fields).

### `POST /api/documents`

Create from inline text.

**Body**

| Field | Type | Required |
| --- | --- | --- |
| `title` | string | yes (1–500 chars) |
| `content` | string | yes |
| `sourceType` | `"text"` \| `"markdown"` | yes |
| `userId` | string | no |
| `metadata` | object | no |

Returns creation + workflow **`runId`** / status for async ingest (see service).

### `POST /api/documents/upload`

**Multipart** form: part **`file`** (required) + optional **`userId`** (text). PDF / text / markdown, **max 10 MB**, MIME validated.

Returns **`documentId`**, **`runId`**, **`processing`** status.

### `GET /api/documents/:id`

Single document metadata + chunks (when ready).

### `DELETE /api/documents/:id`

Deletes document and cascaded chunks.

### `POST /api/documents/:id/reprocess`

Re-runs ingestion (embeddings refreshed). Returns new **`runId`**.

### `GET /api/documents/:id/ingest-status`

**Query:** `runId` (workflow run).

Poll until status is terminal (`completed` / `failed` / etc. — see handler).

---

## Search

### `POST /api/search`

**Body:** `{ query: string, limit?: number }` — `limit` 1–20, default **5**.

**Response:** ranked chunk list (hybrid + MMR). No HyDE.

### `POST /api/search/rag`

**Body:** `{ query: string, limit?: number, userId?: string }`.

**Response:** `{ query, results, context, sources }` — `context` is `[n]`-numbered passages for prompting; **no** LLM call here.

### `POST /api/search/inspect`

**Auth:** signed-in session (workspace-scoped). **Body:** `{ query: string, limit?: number }`.

**Response:** embedding preview (first dims), per-phase **latency**, `results`, `sources` — debug endpoint.

---

## Admin

Uses `requireAdmin` (see conventions).

### `GET /api/admin/metrics`

Prometheus text exposition (`text/plain`) — request counters and span latency summaries from `server/utils/metrics.ts`.

### `GET /api/admin/stats`

Aggregate counts: documents, chunks, queries, latency percentiles, ingest status breakdown, tool-call share.

### `GET /api/admin/usage`

Recent query log and latency stats.

### `GET /api/admin/users`

List users (admin UI for role changes).

### `PATCH /api/admin/users/:id`

Body: `{ role: 'admin' | 'user' }` — promote or demote users.

### `GET /api/admin/settings`

**Query:** `category` — read tunable settings.

### `POST /api/admin/settings`

**Body:** `{ key, value, category }` — upsert a setting.

---

## Related docs

- [RAG pipeline](/features/rag-pipeline)  
- [Hybrid search & HyDE](/features/search)  
- [Architecture](/architecture/)
