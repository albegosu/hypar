# Plan: Adopt Vercel OSS in `from-zero-rag`

## Context

`from-zero-rag` is a Nuxt 3 RAG app with a fully custom LLM/embedding/agent layer (Google Gemini + OpenAI + Ollama via hand-rolled HTTP calls in `server/utils/embedding.ts` and `server/utils/agent.service.ts`). The chat at `pages/index.vue` does not stream. Document ingestion is a synchronous request handler with no retries. We want to replace the bespoke pieces with battle-tested Vercel OSS where the fit is real.

You picked three targets: **AI SDK**, **Workflow SDK**, **Chat SDK**. Verdicts after research:

- **AI SDK** — strong fit. Officially supports Nuxt/Vue (`@ai-sdk/vue` exposes a `Chat` class; `streamText`, `generateText`, `embed`, `embedMany`, tool calling all work server-side in Nitro). **Adopt (Tier 1).**
- **Workflow SDK** — good fit for the ingestion pipeline (chunk → embed → upsert): durability + per-step retries on large uploads. **Adopt (Tier 2).**
- **Chat SDK** — **dropped** per your decision. It's a unified SDK for messaging-platform bots (Slack/Teams/Discord/WhatsApp/etc.), not for the in-app browser chat, and you don't want a bot surface.

## Tier 1 — AI SDK migration (the main win)

### Packages
- `ai`, `@ai-sdk/vue`
- `@ai-sdk/google`, `@ai-sdk/openai`
- `ollama-ai-provider` (community provider; the AI SDK doesn't ship a first-party Ollama package)
- `zod` (tool input schemas)

### Files to change

**`server/utils/embedding.ts`** — replace the manual provider switch with `embed` / `embedMany`. Map the existing `EMBEDDING_PROVIDER` env var to the right SDK provider model. Keep the exported function signatures the same so callers (`server/api/documents/*`, `server/utils/search.service.ts`) don't have to change.

**`server/utils/agent.service.ts`** — replace prompt-based routing with `generateText({ tools: { searchKnowledgeBase: tool({ inputSchema: z.object({ query: z.string() }), execute: ... }) } })`. The model decides whether to call the RAG tool — kills the brittle hand-written planner.

**New `server/api/chat.post.ts`** — `streamText({...}).toUIMessageStreamResponse()` so tokens stream to the browser.

**`pages/index.vue`** — replace manual `$fetch` with `@ai-sdk/vue`'s `Chat` class:
```ts
import { Chat } from '@ai-sdk/vue'
const chat = new Chat({ api: '/api/chat' })
```
Memory commands (`/remember`, `/forget`) stay as a thin pre-processor before `chat.sendMessage()`.

**Markdown rendering** — Streamdown (Vercel's streaming markdown renderer) is React-only with no Vue port. Use `markdown-it` + `highlight.js`, or `vue-markdown-render`, to render the streamed assistant messages with syntax highlighting.

### Critical files to read before implementing
- `package.json`
- `server/utils/embedding.ts`
- `server/utils/agent.service.ts`
- `server/utils/search.service.ts`
- `server/api/agent/*` (current chat endpoint)
- `pages/index.vue`
- `nuxt.config.ts`

## Tier 2 — Workflow SDK for durable ingestion

Wrap document ingestion (the upload endpoint under `server/api/documents/`) in a Workflow SDK durable function so chunking + embedding + pgvector upsert survives crashes and retries each step independently. Concretely:

- Define a workflow with steps: `parseDocument` → `chunkText` (already in `server/utils/chunking.ts`) → `embedChunks` (uses the new AI SDK `embedMany`) → `upsertToPgvector`.
- Trigger it from the upload route; return a workflow run ID immediately so the UI can poll progress.
- Add a `/api/documents/:id/status` endpoint that reads the workflow run state.

This is most valuable once users upload large files (PDFs, long docs); for small text it's overkill. Implement after Tier 1 is green.

### Critical files
- `server/api/documents/upload.post.ts` (or equivalent — confirm exact path during implementation)
- `server/utils/chunking.ts`

## Verification

After Tier 1:
1. `pnpm install` succeeds; `pnpm build` passes type check.
2. `docker compose up` brings DB + Ollama healthy.
3. Upload a doc via `/upload` → confirm chunk + embedding row counts match pre-migration.
4. Ask a chat question that hits the knowledge base → assistant response **streams token-by-token** (new behavior).
5. Ask a question that doesn't need RAG → tool isn't called; direct LLM answer streams.
6. `/remember foo` then ask a follow-up needing memory → still works.
7. Switch `EMBEDDING_PROVIDER` between Google / OpenAI / Ollama → all three still produce searchable results.

After Tier 2:
1. Upload a large document; kill the dev server mid-ingestion; restart → workflow resumes from the last completed step instead of starting over.
2. Force a transient embedding failure (e.g., revoke API key briefly) → only the failing step retries.
