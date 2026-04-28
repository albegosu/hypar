# Documentation Index

This folder contains technical and product documentation for the project.

## Core Docs

- `architecture/core-rag-architecture.md`: technical architecture of the core RAG app
- `learning/learning.md`: learning and onboarding notes
- `product/gamification-summary.md`: gamification and challenge-system overview
- `progress/phase-0-baseline-checklist.md`: smoke checklist used during cleanup and reorganization
- `progress/docker-profiles-smoke-checklist.md`: smoke checklist for docker profile validation

## Docker Profiles

Use a single compose file with profiles:

- Full stack: `docker compose --profile full up --build -d`
- API standalone: `docker compose --profile api up --build -d`
- Learning playground: `docker compose --profile learning up --build -d`

Legacy API-only compose has been archived at:

- `archive/docker/rag-api-docker-compose.legacy.yml`

## Archive

Historical session/progress reports are stored in:

- `archive/progress/expansion-update.md`
- `archive/progress/level3-complete.md`
- `archive/progress/session-summary.md`

Use archived docs as historical context, not as the source of truth for current implementation.
