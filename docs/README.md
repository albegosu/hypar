# Documentation Index

Technical and product documentation for From Zero RAG.

## Core Docs

- [`architecture/core-rag-architecture.md`](architecture/core-rag-architecture.md) — technical architecture of the unified Nuxt 3 app
- [`learning/learning.md`](learning/learning.md) — RAG Learning Quest user guide
- [`product/gamification-summary.md`](product/gamification-summary.md) — gamification and challenge-system overview

## Docker

```bash
# Full stack (app + postgres + ollama)
docker compose --profile full up -d --build

# Infrastructure only (no app)
docker compose --profile api up -d --build
```

See [DOCKER.md](./DOCKER.md) for the complete guide.

## Archive

Historical session/progress reports are in [`archive/progress/`](archive/progress/). Use these as historical context only — they describe the old monorepo structure.
