# Learning quest

The **RAG Learning Quest** is an in-app tutorial at **`/learn`**: Monaco-based coding challenges that teach embeddings, chunking, and vector search without leaving the main Nuxt app.

---

## What you get

- **3 levels** — embeddings → chunking → vector database  
- **9 challenges** with increasing difficulty and **XP**  
- **Monaco editor** in the browser with validation against real test cases  
- **Progress** persisted locally (badges and unlock rules)

---

## Routes (high level)

| Path | Role |
| --- | --- |
| `/learn` | Hub / level map |
| `/learn/challenge/:id` | Individual challenge |
| `/learn/onboarding` | 6-step guided setup wizard |

Vue pages live under `pages/learn/`; challenge definitions and validators under `utils/learning/`.

---

## Onboarding wizard

The wizard at `/learn/onboarding` walks through 6 configuration steps and downloads a ready-to-use `.env` file:

| Step | What it configures |
| --- | --- |
| 1 · APIs | Embedding provider (`EMBEDDING_PROVIDER`) + LLM provider (`LLM_PROVIDER`) with per-provider keys and models |
| 2 · Vector DB | Database type: **self-hosted pgvector** (generates `DATABASE_URL` from host/port/name) or **Supabase Vector** (generates connection string from project ref + password) |
| 3 · Embeddings | Batch size, cache TTL, retry attempts |
| 4 · Chunking | Strategy, chunk size, overlap, max doc size, allowed formats |
| 5 · Search | `SEARCH_TOP_K`, similarity threshold, hybrid search toggle, rerank toggle |
| 6 · RAG | Temperature, system prompt, max context tokens, response language |

**Supported embedding providers:** Gemini, OpenAI, Voyage AI, Ollama (local).  
**Supported LLM providers:** Anthropic, OpenAI, Mistral, Ollama Cloud, Ollama (local).

Steps 1 and 2 generate env vars that are fully wired to the runtime. Steps 3–6 generate documented vars; see [RAG pipeline — Next steps](./rag-pipeline#next-steps--wizard-runtime-alignment) for the planned wiring work.

---

## Deeper guide

The product-focused walkthrough (XP tables, unlock rules, hint penalties) is maintained here:

👉 **[RAG Learning Quest (full guide) →](/learning/learning)**

---

## Next

- [RAG pipeline →](./rag-pipeline)  
- [Architecture →](/architecture/)  
- [Contributing →](/contributing)
