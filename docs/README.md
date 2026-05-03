# Documentation Index

Technical and product documentation for fragua.

## Core Docs

- [`architecture/index.md`](architecture/index.md) — architecture landing (links to deep dives)
- [`architecture/core-rag-architecture.md`](architecture/core-rag-architecture.md) — technical architecture of the unified Nuxt 3 app
- [`guide/env.md`](guide/env.md) — environment variables (canonical: root `.env.example`)
- [`learning/learning.md`](learning/learning.md) — RAG Learning Quest user guide
- [`product/gamification-summary.md`](product/gamification-summary.md) — gamification and challenge-system overview

## Features (VitePress site)

- [`features/rag-pipeline.md`](features/rag-pipeline.md) — ingestion → retrieval → chat
- [`features/search.md`](features/search.md) — hybrid vector + BM25, HyDE, MMR
- [`features/memory.md`](features/memory.md) — scopes and slash commands
- [`features/learning-quest.md`](features/learning-quest.md) — `/learn` overview

## API

- [`api/reference.md`](api/reference.md) — HTTP routes and request shapes

## Contributing (docs mirror)

- [`contributing.md`](contributing.md) — short summary; full text in repo root `CONTRIBUTING.md`

## Docker

```bash
# Full stack (app + postgres + ollama)
docker compose --profile full up -d --build

# Infrastructure only (no app)
docker compose --profile api up -d --build
```

See [DOCKER.md](./DOCKER.md) for the complete guide.

## Archive

Historical session/progress reports live under [`docs/archive/progress/`](./archive/progress/session-summary.md) (see that folder on disk). Use them as historical context only — they describe older iterations of the project.
