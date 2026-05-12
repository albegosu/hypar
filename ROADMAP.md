# hypar — Roadmap (May → December 2026)

> **North Star.** By the end of 2026, hypar should ship as **v1.0** that triples as a portfolio piece, a reusable open-source library, and a self-contained tutorial for learning RAG end-to-end — with first-class Spanish-language support as a deliberate differentiator.

This roadmap is intentionally honest about what is *already done* and where the work *actually is* between today and v1.0. It is sized for **~10–15 hours per week** and assumes Alberto continues to work on the project alone, opening the door to outside contributors gradually as the surface stabilises.

---

## Where we are (snapshot, May 2026)

### Shipped in this repository today

hypar is a substantial, production-shaped **multi-user** RAG application on **Nuxt 3**. The retrieval pipeline (pgvector HNSW + BM25 hybrid with MMR re-ranking, optional HyDE, score-floor filtering) is wired end-to-end with citations and persisted audit trails. Ingestion is durable through the Vercel Workflow SDK with retries and per-step status. Multi-provider embeddings (Gemini / OpenAI / Ollama) abstract away the model choice. There is a **Vitest** suite, **Docker Compose** profiles, **`better-auth`** with an `/admin` surface, and a **VitePress** site under `docs/` (guides plus ADRs/RFCs) built by `pnpm docs:build` and **deployed to GitHub Pages** when `docs/**` changes on `main`.

### Planned / not wired up yet (called out explicitly so the roadmap stays honest)

- A **`pnpm eval`** golden-set harness (hit-rate, MRR, latency) checked into the repo and run in CI.
- A **Monaco “learning quest”** UI and `/learn` routes (the old monorepo had a separate playground; the unified app has not reintroduced it).
- **Strict `admin`-role enforcement** on every `/api/admin/*` handler (today, authenticated session or optional `ADMIN_API_KEY` — see `server/utils/admin-auth.ts`).

That is the foundation. The rest of 2026 is about turning a working app into a piece of work that *clearly demonstrates professional-grade engineering*: observability, advanced retrieval techniques, security hardening, public benchmarks, a contributor-friendly surface, and a tutorial worth following. None of the items below restart what already works — they harden, generalise, measure, and explain it.

---

## Where we want to land (v1.0, December 2026)

By v1.0, a visitor to the GitHub repo should immediately understand three things. First, that hypar is a serious reference implementation of a modern RAG stack written in TypeScript on Nuxt 3 — with public, reproducible benchmark numbers (hit-rate, MRR, RAGAS faithfulness, p95 latency, cost-per-query) on at least one real-world dataset. Second, that anyone can run `pnpm create hypar-app` (or equivalent) to scaffold a working RAG against their own corpus, swap pgvector for Qdrant or Weaviate without rewriting business logic, and deploy via Docker, Vercel, Fly.io, or Kubernetes following a copy-paste recipe. Third, that there is a complete learning curriculum behind it — **written VitePress chapters** (and, if we bring it back, an interactive quest) that take a reader from "what is an embedding" to "how do I evaluate a production RAG" using hypar's own code as the running example, available in both Spanish and English.

Concrete v1.0 success criteria (checked at year-end):

| Dimension | v1.0 target |
|---|---|
| Tests | ≥80% line coverage on `server/utils/**`, ≥70% overall, CI green on PRs |
| Eval harness | Hit-rate ≥0.85, MRR ≥0.7, RAGAS faithfulness ≥0.8 on a public dataset (e.g. SQuAD-es subset) |
| Latency | p50 < 800 ms, p95 < 2.0 s for streaming first-token on a 50k-chunk corpus |
| Observability | Per-request trace (Langfuse or OpenLLMetry) with cost, tokens, retrieval scores |
| Vector store | At least one alternative backend behind a stable interface (Qdrant *or* Weaviate) |
| Tutorial | 8 written chapters, 4 of them bilingual ES/EN, linked from VitePress |
| Community | Issue & PR templates, RFC process, CODEOWNERS, ≥10 closed issues from non-Alberto contributors |
| Release hygiene | Semantic versioning, changelog generated from Conventional Commits, signed git tags |

These are deliberately ambitious but reachable at 10–15 hrs/week if scope is protected. The monthly plan below is the lever.

---

## Three tracks

Every month advances three tracks in parallel. The point is to never finish a feature without also turning it into something teachable and something that strengthens the portfolio narrative.

**Library track.** Make hypar reusable by other people. This means stable interfaces, swappable backends, a scaffolding CLI, semver discipline, and explicit extension points (custom rerankers, custom embedders, custom routers).

**Tutorial track.** Make hypar teachable. The **VitePress** shell under `docs/` is live on GitHub Pages; it should grow with chapters that walk a reader through the *real code* of hypar — not toy examples — covering one concept at a time. A **Monaco learning quest** (or similar) would be reintroduced in lockstep when that UI lands again.

**Portfolio track.** Make hypar impressive in 60 seconds to a hiring manager. Public benchmarks, a hosted demo with anonymous traffic, a recorded walkthrough, a write-up of a real problem you solved, and a clean GitHub front page that signals seniority.

A feature is highest-priority when it advances all three tracks at once. Most do, if planned that way.

---

## Monthly plan

> **Scenario planning.** The subsections from May through December are **intent and themes**, not a guarantee of what is shipped in the repo at each date. For what is actually in `main`, see *Where we are (snapshot)* above and the codebase.

Each month has a single **theme** that anchors the work. Inside the theme, deliverables are split across the three tracks. Time estimates are realistic given competing life demands; if a month runs over, the *theme* matters more than any single deliverable, so trim the lowest-impact items first.

### May 2026 — Observability & honest measurement *(theme: see what your RAG is actually doing)*

The retrieval and generation logic is sophisticated but mostly invisible at runtime. Before adding new techniques, instrument what is there so any change can be measured. **Library:** integrate Langfuse (preferred — open-source, self-hostable) or OpenLLMetry tracing across `search.service`, `agent.service`, and the ingest workflow; emit spans with retrieval scores, MMR drops, embedding/LLM token counts, and per-provider cost. Add a `/metrics` Prometheus endpoint behind the admin key. **Tutorial:** new VitePress chapter "Observing a RAG" — what to log, why, with screenshots from hypar's own traces. **Portfolio:** expand `evals/golden.jsonl` to ~50 questions covering both English and Spanish, run weekly via a GitHub Action and commit the JSON results so improvements are visible in git history.

*Estimated: ~50 hrs.* Release at end of month: **v0.4** — "hypar, but you can see inside it."

### June 2026 — Retrieval quality leap *(theme: state-of-the-art recall and precision)*

Now that you can measure, push retrieval. **Library:** replace the current cosine-OR-BM25 score blend with **Reciprocal Rank Fusion (RRF)** — well-studied, no tuning constants, easier to teach. Add a **cross-encoder reranker** as an optional final stage (`bge-reranker-v2-m3` via a small Python sidecar or ONNX in-process — pick whichever lets you stay in the Node process). Add **query decomposition** for multi-part questions (LLM rewrites the user's question into 1–3 sub-queries; retrieve+merge). **Tutorial:** chapter "Hybrid retrieval explained" + chapter "When does reranking help?" with before/after numbers from your own eval harness. **Portfolio:** publish first benchmark report — table comparing baseline / +RRF / +reranker / +decomposition on hit-rate, MRR, latency, cost.

*Estimated: ~55 hrs.* Release: **v0.5** — first version worth recommending to others. Tag, sign, write release notes.

### July 2026 — Evaluation as a first-class citizen *(theme: trust your numbers)*

Hit-rate and MRR only tell you whether the right chunk was retrieved. They say nothing about whether the *answer* was faithful, relevant, or grounded. **Library:** integrate **RAGAS-style metrics** (faithfulness, answer relevance, context precision, context recall) — implement them yourself in TS rather than wrapping the Python lib; this becomes a teaching asset. Add **regression evals on PRs**: a GitHub Action runs a fast subset of the golden set and posts a comment with deltas vs. main. **Tutorial:** chapter "Evaluating a RAG without lying to yourself" — explains each metric, when each is misleading, and shows hypar's PR-comment workflow. **Portfolio:** record a 5-minute screencast of a PR that intentionally regresses retrieval, showing CI catching it; embed in README.

*Estimated: ~50 hrs.*

### August 2026 — Security & robustness pass *(theme: make this safe to expose)*

Anything that touches public input + LLMs needs deliberate hardening. Walk the **OWASP LLM Top 10** as an explicit checklist applied to hypar. **Library:** prompt-injection defenses (instruction hierarchy, retrieved-context delimiters, output validation), PII redaction at ingest time (configurable, off by default with a clear example config), per-document ACLs in the schema (`Document.ownerId`, retrieval queries automatically scoped), secret rotation guidance in docs, dependency audit in CI. **Tutorial:** chapter "Adversarial inputs and how hypar handles them," with a small library of injection prompts you can run against your local instance. **Portfolio:** publish a `SECURITY.md` and run the OWASP LLM checklist as a public document linking to the code that addresses each item.

*Estimated: ~55 hrs.* Release: **v0.7** — "production-ready for small teams."

### September 2026 — Vector-store abstraction *(theme: stop being married to pgvector)*

pgvector is excellent and stays the default, but a library worth its name exposes a swappable interface. **Library:** define a `VectorStore` interface in `server/utils/vectorstore/` with `upsert`, `query`, `delete`, `count`. Refactor pgvector code behind it. Implement a second backend — pick **Qdrant** (gRPC, single binary, easy local) over Weaviate for first cut. Add a config switch `VECTOR_STORE=pgvector|qdrant`. Run the eval harness against both and publish parity numbers. **Tutorial:** chapter "Choosing a vector database in 2026" — what differs between pgvector, Qdrant, Weaviate, Pinecone, with hypar's own benchmark as the running example. **Portfolio:** the abstraction itself is the artefact; one branch shipped a real backend swap with no business-logic changes — that's the screenshot for the README.

*Estimated: ~55 hrs.*

### October 2026 — Tutorial completeness & Spanish parity *(theme: teachable in two languages)*

Most RAG content online is English-only and shallow. Spanish-language quality is your differentiator. **Library:** make sure every API doc-string, error message, and CLI prompt is i18n-ready (you already have `i18n/locales` for the UI; extend the discipline to docs and dev-facing strings). **Tutorial:** complete the curriculum — chapters now total 8, with chapters 1–4 published bilingually (ES + EN). If a Monaco `/learn` quest exists again, add new levels covering reranking, evaluation, and observability so the interactive track matches the written curriculum; otherwise focus the month on VitePress depth. Cross-link every chapter to the file in hypar's source code that implements the concept. **Portfolio:** post a write-up to dev.to / Hacker News / r/MachineLearning ES communities; track inbound stars and engagement.

*Estimated: ~50 hrs.* Release: **v0.9** — feature-complete, content-rich, awaiting v1.0 polish.

### November 2026 — Community-readiness & contributor onboarding *(theme: make it possible for people to help)*

Up to here you have been the only committer. To become a real OSS project, the surface has to invite contribution without endless mentorship. **Library:** add issue templates (bug / feature / question), PR template, `CODEOWNERS`, a lightweight RFC process for non-trivial changes (one-page template under `docs/rfcs/`), `good first issue` and `help wanted` labels with at least 8 well-scoped tickets. Switch to **Changesets** for release notes and bump automation. **Tutorial:** chapter "How to add a new vector store / reranker / embedder to hypar" — turns the extension points into something a contributor can actually exercise. **Portfolio:** apply to speak at one TS-flavoured or AI-flavoured conference (NodeCongress, JSWorld, AI Engineer Summit) in 2027 — submission alone is a portfolio item even if not accepted.

*Estimated: ~50 hrs.*

### December 2026 — v1.0 polish, hosted demo, case study *(theme: make the elevator pitch real)*

The technical work is mostly done; this month is about presentation. **Library:** scaffolding CLI — `pnpm create hypar-app` (or `npx create-hypar-app`) that copies a stripped template with sensible defaults, `.env.example`, and a one-command bring-up. Final dependency audit, license review, signed v1.0 tag. **Tutorial:** record a 20-minute video walkthrough of the whole stack from upload-to-answer; embed in README and on the VitePress home. **Portfolio:** deploy a public hosted demo (Fly.io or Railway, behind a simple rate limit) ingested with a real, interesting corpus — e.g. *all of Cervantes' work*, or the Spanish constitution + key legal codes, or BOE legislation, something distinctively Spanish that English-only competitors cannot easily replicate. Write a single case-study page: *"How hypar answers questions about [corpus] with [hit-rate]/[MRR]/[cost-per-query]"* — this becomes the single link you share when applying for jobs.

*Estimated: ~45 hrs.* Release: **v1.0** — tagged, signed, announced.

---

## Release schedule at a glance

| Version | Target | Theme | Headline |
|---|---|---|---|
| v0.4 | end May | Observability | "See inside your RAG" |
| v0.5 | end Jun | Retrieval quality | RRF + cross-encoder + decomposition |
| v0.6 | end Jul | Evaluation | RAGAS metrics + PR-time regression checks |
| v0.7 | end Aug | Security | OWASP LLM hardening + ACLs |
| v0.8 | end Sep | Pluggability | Qdrant backend + `VectorStore` interface |
| v0.9 | end Oct | Tutorial parity | 8 chapters, ES+EN, 3 new quest levels |
| v0.9.x | end Nov | Community | Templates, RFCs, Changesets, good-first-issues |
| **v1.0** | **end Dec** | **Public launch** | **Hosted demo + case study + scaffolding CLI** |

---

## Explicit non-goals (protect scope)

A roadmap is also a list of things you will *not* do this year. The temptations below are real but would crowd out v1.0:

- **Graph RAG / knowledge-graph extraction.** Interesting, costly to do well, not what most RAG users need. Defer to 2027.
- **Multi-modal (image / table / chart) ingestion beyond text-extracted PDFs.** Same reason.
- **ColBERT / late-interaction retrieval.** Cross-encoder rerankers cover ~80% of the quality gain at 20% of the engineering cost.
- **Self-hosted fine-tuned embeddings.** Sticking with off-the-shelf providers is the right teaching choice anyway.
- **Mobile / native client.** The Nuxt 3 web UI is the demo surface.
- **Switching to Python.** TypeScript-end-to-end is a deliberate differentiator. Python sidecars (e.g. for the cross-encoder reranker) are acceptable; rewriting core logic is not.

If a contributor wants any of the above, accept it as a third-party extension under `examples/` rather than core.

---

## Risks & mitigations

The single biggest risk is **scope creep into ML research**. RAG is a fashionable field with a new technique every month; chasing each one would derail v1.0. Mitigation: every new retrieval idea must clear the bar of *"does this measurably improve our golden-set numbers, and can it be explained in one tutorial chapter?"* If not, it goes in a backlog file, not on the roadmap.

The second risk is **tutorial debt**. It is easy to ship a feature in code and forget to write the chapter. Mitigation: each PR that introduces a user-visible behaviour must include a docs change in the same PR — enforced by a simple CI check that fails if `server/**` or `prisma/**` changed without a corresponding `docs/**` edit (configurable, with an opt-out label for chores).

The third risk is **burnout from solo work**. 10–15 hrs/week sustained for 8 months is a lot. Mitigation: the November "community-readiness" milestone is partly a self-care lever — once contribution friction is low, even one weekly external PR pays back the time spent making it possible.

---

## How to use and update this roadmap

This file is a living document. At the **start of each month**, open a tracking issue titled `Month plan: <month> 2026`, copy that month's section into it, and check items off as they land. At the **end of each month**, append a short retro to a new file `docs/retros/<YYYY-MM>.md` — what shipped, what slipped, what changed your mind. Quarterly (end of June, September, December), revisit this roadmap and adjust the next quarter; do not rewrite history, only the unshipped months.

The roadmap version should match the latest released version. Bump the date in the title and the table whenever the schedule meaningfully changes.

---

*Last updated: 2026-05-08 · Author: Alberto González · License: MIT (same as project)*
