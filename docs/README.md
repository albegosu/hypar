# Documentation Index

Technical and product documentation for hypar.

## Core docs (current app)

- [`architecture/index.md`](architecture/index.md) — architecture landing (links to deep dives)
- [`architecture/core-rag-architecture.md`](architecture/core-rag-architecture.md) — technical architecture of the unified Nuxt 3 app
- [`architecture/project-structure.md`](architecture/project-structure.md) — directory tour (kept aligned with `main`)
- [`guide/env.md`](guide/env.md) — environment variables (canonical: root `.env.example`)

## Legacy / design reference (not shipped on `main`)

These describe the old **Monaco `/learn` quest** and gamification; kept for history and future reintroduction:

- [`learning/learning.md`](learning/learning.md) — original quest user guide (**legacy**)
- [`product/gamification-summary.md`](product/gamification-summary.md) — XP / challenge mechanics (**legacy**)
- [`features/learning-quest.md`](features/learning-quest.md) — **status** of `/learn` vs current repo

## Features (VitePress site)

- [`features/rag-pipeline.md`](features/rag-pipeline.md) — ingestion → retrieval → chat
- [`features/search.md`](features/search.md) — hybrid vector + BM25, HyDE, MMR
- [`features/memory.md`](features/memory.md) — scopes and slash commands

## API

- [`api/reference.md`](api/reference.md) — HTTP routes and request shapes

## Contributing (docs mirror)

- [`contributing.md`](contributing.md) — short summary; full text in repo root `CONTRIBUTING.md`

## Design notes

- [`decisions/monorepo-unification.md`](decisions/monorepo-unification.md) — ADR (historical merge plan)
- [`rfcs/2026-auth-phases.md`](rfcs/2026-auth-phases.md) — auth / multi-user RFC (some paths are staging-era; see banner inside)

## Docker

```bash
# Full stack (app + postgres + ollama)
docker compose --profile full up -d --build

# Infrastructure only (no app)
docker compose --profile api up -d --build
```

See [DOCKER.md](./DOCKER.md) for the complete guide.

## Archive

Historical session/progress reports live under [`docs/archive/progress/`](./archive/progress/session-summary.md) (see that folder on disk). Use them as historical context only — they describe older iterations of the project. See also [`archive/README.md`](./archive/README.md).

## Repo root scratch

[`agents-plans/`](https://github.com/albegosu/from-zero-rag/tree/main/agents-plans) at the repository root holds **internal** agent/session notes, not part of this VitePress site. See [`agents-plans/README.md`](https://github.com/albegosu/from-zero-rag/blob/main/agents-plans/README.md).
