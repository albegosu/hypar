# Roadmap

hypar targets **v1.0 by December 2026**, serving three audiences simultaneously: a drop-in RAG library, a learn-from-zero tutorial, and a portfolio-grade production demo.

This page tracks what is already shipped, what is in progress, and what comes next — broken down by the three tracks.

---

## Status legend

| Symbol | Meaning |
| --- | --- |
| ✅ | Shipped |
| 🚧 | In progress |
| 📋 | Planned (v0.x – before v1.0) |
| 🔭 | Stretch goal (may slip to post-v1.0) |

---

## What is already shipped

Everything below is live on `main` and documented in these docs.

| Area | Highlights |
| --- | --- |
| **Stack** | Nuxt 3 + Nitro, Vue 3, Pinia, Tailwind 4, Nuxt UI v3 |
| **Database** | PostgreSQL 16 + pgvector, Prisma 7 + `@prisma/adapter-pg` |
| **Embeddings** | Gemini, OpenAI, Voyage, Ollama (`nomic-embed-text` 768d) |
| **Chunking** | ~400 tokens / 60 overlap, `js-tiktoken` cl100k_base |
| **Retrieval** | HNSW cosine + BM25 hybrid, MMR diversification, score floor 0.2, HyDE |
| **Generation** | Vercel AI SDK tool-calling, token streaming, inline citations `[1]` |
| **Memory** | Per-user `/remember`, `/forget`, `/memory clear` commands |
| **Ingestion** | Workflow SDK durable job (parse → embed → persist → markStatus) |
| **Ops** | Rate limits, admin API key gate, Zod validation, 64 KB chat cap |
| **Eval harness** | `pnpm eval` — hit-rate, MRR, p50/p95 latency over `evals/golden.jsonl` |
| **Tests** | Vitest — chunking, text utils, agent commands |
| **Docs** | This VitePress site, GitHub Pages deploy |
| **Learning quest** | `/learn` — 3 levels, 9 challenges, 650 XP, Monaco editor |
| **Deployment** | Docker Compose profiles (`full`, `api`, `all`), Caddyfile, GitHub Actions |
| **Runtime settings** | DB-backed settings UI for steps 3–6 (`feat/runtime-envs` branch) |

---

## Track 1 — Library

> Goal: `pnpm create hypar-app` scaffolds a working RAG in minutes. Swap vector stores without rewriting business logic.

| Item | Status | Notes |
| --- | --- | --- |
| Vector-store adapter abstraction | 📋 | Unified interface over pgvector, Qdrant, Weaviate, Pinecone |
| `pnpm create hypar-app` CLI scaffolder | 📋 | Interactive prompts: provider, vector store, LLM |
| npm package publish (`hypar-core`) | 📋 | Tree-shakable, ESM-first |
| Qdrant adapter | 📋 | First alternative store after pgvector |
| Pinecone / Weaviate adapters | 🔭 | Post-v1.0 if pgvector + Qdrant cover the common cases |

---

## Track 2 — Tutorial

> Goal: VitePress site grows into a full RAG-from-zero curriculum, paired with the Monaco learning quest. Spanish-language first-class.

| Item | Status | Notes |
| --- | --- | --- |
| Chunking deep-dive chapter | 📋 | Token math, overlap trade-offs, when to use semantic chunking |
| Embeddings chapter | 📋 | Providers, dimensions, cosine vs. dot-product |
| Hybrid search & HyDE chapter | 📋 | Expand the existing feature doc into a full tutorial |
| Eval chapter | 📋 | How to write `golden.jsonl` entries, interpret hit-rate / MRR |
| Spanish translations of core chapters | 📋 | Differentiator vs. English-only resources |
| Level 4 — Hybrid Search quest | 📋 | New Monaco challenge extending the learning quest |
| Level 5 — Eval quest | 🔭 | Stretch; depends on how far Level 4 gets |

---

## Track 3 — Portfolio

> Goal: public benchmarks on a real dataset, observability, prompt-injection defenses, cost dashboard, and at least one conference-talk-quality case study.

| Item | Status | Notes |
| --- | --- | --- |
| RAGAS faithfulness integration | 📋 | Add faithfulness + answer-relevancy to `pnpm eval` output |
| Real benchmark dataset | 📋 | Curated domain-specific `golden.jsonl` (≥100 Q&A pairs) |
| Cost dashboard | 📋 | Token usage per query / per user, aggregated by provider |
| Prompt-injection defenses | 📋 | Input sanitization + canary-token detection, documented with PoC |
| Observability (traces & spans) | 📋 | OpenTelemetry integration, Jaeger/Grafana example |
| Public benchmark results page | 📋 | Hit-rate / MRR / faithfulness published in docs |
| Conference case study | 🔭 | Slide deck + write-up once portfolio track stabilises |

---

## Milestones

| Milestone | Target | Exit criteria |
| --- | --- | --- |
| **v0.5** | Q3 2026 | Vector-store abstraction merged; Chunking + Embeddings tutorial chapters published; RAGAS in `pnpm eval` |
| **v1.0** | Q4 2026 | `pnpm create hypar-app` working end-to-end; full tutorial curriculum (ES + EN); public benchmark results live |

---

## Out of scope for v1.0

The following are interesting but deferred to avoid crowding the three-track polish:

- Graph RAG / knowledge-graph retrieval
- ColBERT late-interaction re-ranking
- Multi-tenant SaaS mode
- Real-time collaborative documents

---

## Contributing

Want to help ship one of these items? Open an issue on [GitHub](https://github.com/albegosu/from-zero-rag/issues) to discuss scope before starting, then follow the [Contributing guide](/contributing).
