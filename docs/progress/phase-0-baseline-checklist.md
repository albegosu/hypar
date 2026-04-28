# Phase 0 Baseline Checklist

This checklist defines the minimum smoke tests we use before and after each cleanup phase to ensure we do not break runtime behavior.

## Scope

- Core RAG app: `rag-api` + `rag-ui`
- Learning app: `packages/rag-playground` + `packages/rag-learning`
- API contracts that must remain stable during cleanup

## Canonical Run Commands

From repo root:

- API only: `pnpm dev:api`
- UI only: `pnpm dev:ui`
- Learning playground: `pnpm dev:playground`

## API Contract Smoke (rag-api)

Start API with `pnpm dev:api`, then verify:

- `GET /health` returns `status: "ok"`
- `POST /search` is reachable
- `POST /search/rag` is reachable
- `POST /search/inspect` is reachable
- `POST /search/converse` is reachable
- `GET /documents` is reachable
- `POST /documents` is reachable
- `POST /documents/upload` is reachable

Current contract references:

- `rag-api/src/app.controller.ts`
- `rag-api/src/search/search.controller.ts`
- `rag-api/src/documents/documents.controller.ts`

## Core UI Smoke (rag-ui)

Start UI with `pnpm dev:ui` (with API running), then verify:

- Home page loads
- Upload page loads and can submit a test file
- Documents index loads
- Document detail loads
- Search action returns results without frontend runtime errors
- Converse/chat flow works without endpoint mismatch errors

## Learning Playground Smoke (rag-playground)

Start playground with `pnpm dev:playground`, then verify:

- Landing page loads on port 3002
- `/onboarding` loads and renders 6-step wizard nav
- Config fields render and persist updates in localStorage
- `.env` preview is generated and copy/download actions work
- `/level/1` loads
- `/challenge/:id` loads and runs validation without client crash

## Frozen High-Risk Areas During Early Cleanup

Do not refactor behavior in these files until after interface hardening:

- `rag-api/src/search/search.service.ts`
- `rag-api/src/documents/documents.service.ts`
- `rag-api/prisma/schema.prisma`
- `rag-ui/stores/documents.ts`
- `packages/rag-playground/pages/onboarding.vue`

## Pass Criteria Per Cleanup Phase

A phase is complete only if all are true:

- All three run surfaces start with their canonical commands
- API contract smoke checks pass
- Core UI smoke checks pass
- Learning playground smoke checks pass
- No new lint errors in edited files

