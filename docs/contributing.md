# Contributing

Thank you for helping improve hypar. The **canonical** contributing guide (branch naming, commit style, learning challenges) lives in the repository root:

**[`CONTRIBUTING.md`](https://github.com/albegosu/from-zero-rag/blob/main/CONTRIBUTING.md)** (same content as in your clone at the project root).

---

## Quick local setup

```bash
git clone https://github.com/albegosu/from-zero-rag.git
cd from-zero-rag
pnpm install
docker compose --profile api up -d   # Postgres (+ Ollama if you use the profile)
cp .env.example .env                  # then edit DATABASE_URL, keys, etc.
pnpm db:migrate
pnpm dev
```

Open `http://localhost:3000`.

---

## Before you open a PR

```bash
pnpm build   # production build + type checking via Nuxt
pnpm test    # Vitest
pnpm eval    # optional — run when changing retrieval / chunking
pnpm db:migrate   # only if Prisma schema changed
```

---

## Where to change things

| Goal | Likely paths |
| --- | --- |
| RAG / search | `server/utils/search.service.ts`, `server/utils/agent.service.ts` |
| Ingestion | `server/workflows/ingest-document.ts`, `server/utils/documents.service.ts` |
| API contracts | `server/api/**/*.ts` |
| UI | `pages/`, `components/` |
| Learning quest | `utils/learning/`, `pages/learn/` |

## Micrographics (UI)

Use the shared kit in [`components/micro/`](https://github.com/albegosu/from-zero-rag/tree/main/components/micro): `MicroGlyph.vue` plus `glyphs.ts` (stroke `1.5`, `currentColor`). Prefer **semantic** glyphs for empty states and headings; add **decorative** ones only at low density (`aria-hidden="true"` via `decorative` on `MicroGlyph`). In the docs theme, chapter pages can start with `<DocMicroLead />`. **Animation** (GSAP) is optional and should respect `prefers-reduced-motion` — match the landing pattern in `docs/.vitepress/theme/HomeLandingAnimations.vue` when extending motion.

Questions or large features: open a **[GitHub issue](https://github.com/albegosu/from-zero-rag/issues)** first when in doubt.
