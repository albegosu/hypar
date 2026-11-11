# Architecture

Hypar is a **single Nuxt 3 application**: Vue 3 on the client, **Nitro** (`h3`) server routes on the same port, **Prisma 7** + **PostgreSQL** for persistence, and the **Vercel AI SDK** for agent interactions, through the user's own provider (Anthropic, OpenAI, Ollama Cloud) or the server Ollama fallback.

There is no separate API repo and no CORS split — the UI calls relative `/api/*` routes.

---

## High-level diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Vue 3)                        │
│  pages/*  components/*  Pinia stores                       │
└──────────────────────────┬────────────────────────────────┘
                           │ same origin
┌──────────────────────────▼────────────────────────────────┐
│                  Nitro server (Nuxt)                      │
│  server/api/embryos/*  — CRUD + agent SSE                 │
│  GET /api/health       — db check                         │
│  server/utils/*        — prisma, session, logger, agent   │
└───────────────┬───────────────────────┬───────────────────┘
                │                       │
                ▼                       ▼
          PostgreSQL 16           Ollama (local or cloud)
                                  via OpenAI-compatible API
```

---

## Domain: Embryo

The data model centers on the **Embryo** — a unit of knowledge with a lifecycle.

| Model | Purpose |
| --- | --- |
| **Embryo** | The idea. Immutable `seed`, `state`, optional fossil fields. |
| **EmbryoEvent** | Append-only audit: state changes, tensions, agent questions, replies. |
| **Tension** | An open question attached to an embryo. Raised by user or agent. |
| **Connection** | A typed directed link: `REINFORCES`, `CONTRADICTS`, `EXTENDS`, `RESURRECTS`. |
| **AgentNote** | HITL pending work: question, connection, path, fossil or transplant proposal. |

States: `LATENT → GERMINATING → GROWING → MATURING`, ending in `FOSSIL` or `TRANSPLANTED` ([ADR 0005](/decisions/0005-transplanted-and-maturing))

No delete. Fossilization preserves the idea, the reason it died, and its full event history.

User transitions are free jumps among living states (including backward). The only automatic advance is **first successful agent turn on `LATENT` → `GERMINATING`**. Fossils reject further PATCH and agent calls (`409`). Transplanted embryos reject agent calls and every PATCH except `add_note`.

---

## Agent integration

`POST /api/embryos/[id]/agent` streams SSE `{ type: chunk | done | error }`. On `done` the payload includes `question`, `move`, and optional `connections`, `paths`, `fossil`. The client maps those onto `ai-elements-nuxt` primitives (`AiMessage`, `AiConfirmation`, `AiQueue`, canvas). See [ai-elements surfaces](/experiments/ai-elements-surfaces).

The agent's spoken turn is constrained: **exactly one challenging question**. Stance follows lifecycle (define → probe → generate paths → select the simplest). Path and fossil proposals are additive fields, not a second question. No summaries, no validation, no preamble, no named methodology in the question.

Context the agent actually receives:

- The current embryo (seed, state, unresolved tensions, recent dialogue)
- Up to **15 other living embryos** and **5 fossils**
- Outgoing connection targets already linked from this embryo

Agent-detected links are stored as unconfirmed `Connection` rows (`detectedBy: AGENT`) plus a HITL note. Accept confirms; dismiss deletes the unconfirmed row. The graph draws dashed inferred edges.

---

## HTTP surface (embryos)

| Route | Role |
| --- | --- |
| `GET/POST /api/embryos` | List (own) / create `LATENT` |
| `GET/PATCH /api/embryos/:id` | Detail / actions (`transition`, tensions, `connect`, `reply`, accept path/fossil, dismiss note) |
| `POST /api/embryos/:id/agent` | SSE collaborator turn (optional `{ model }`) |
| `POST /api/embryos/:id/research` | Web research; findings become sourced tensions |
| `POST /api/embryos/:id/fossilize` | Close with a required reason |
| `POST /api/embryos/:id/germinate-notice` | Logs that the first-confrontation notice was left (`via`, `visibleMs`); measurement only |
| `GET /api/observations` | Your own events aggregated into the lab's validation signals (see below) |
| `GET /api/llm/models` | Models from the user's provider, or Ollama tags on the fallback |
| `GET/PUT /api/settings` | Web research switches, engage on first open, living-peer limit (0–15), and whether research is available |
| `GET/PUT/DELETE /api/llm/provider` | The user's provider connection (key encrypted, never returned) |
| `GET /api/health` | `{ status, checks.db, ts }` — unauthenticated, used by Compose |

All embryo and LLM routes call `requireSessionUserId`. Ownership is `userId` on every query.

---

## Layer responsibilities

| Layer | Path | Responsibility |
| --- | --- | --- |
| UI | `pages/`, `components/embryo/`, `components/garden/` | Garden, detail, collaborator, graph, pending queue, auth, admin stubs, settings (model selector). |
| Method | `utils/embryo-method.ts` | Stance, fossil kinds, copy. |
| API | `server/api/embryos/**` | CRUD, transitions, fossilization, agent SSE. |
| Store | `stores/embryos.ts` | Pinia store with computed views (`byState`, `alive`). |
| Data | `prisma/schema.prisma` | Embryo domain + better-auth models. |

---

## Deployment

- **Development:** `pnpm dev` + local PostgreSQL + Ollama (local or cloud)
- **Docker:** `docker compose --profile full` runs app + Postgres + Ollama
- **Production:** see [Production deployment](/guide/production)

---

## Observations

`/observations` reads your own events into the signals behind the lab's open questions, so they are answered from use and not from a survey:

- **Move × state** — counts of `AGENT_QUESTION` by embryo state and move. If `GROWING` is still almost all `PROBE`, the stance text did not change the questions.
- **Paths in GROWING** — share of `GROWING` turns that opened at least one path.
- **Agent links accepted** — accepted over proposed inferred connections.
- **First confrontation left unread** — share of germination notices left in under 1.5 s, over those left at all.

Turns logged before the state was recorded are left out of the matrix. The aggregation is a pure function in `server/utils/observations.ts`, covered by `tests/observations.spec.ts`.

## Next

- [Embryo concept →](/concepts/embryo)
- [Getting started →](/guide/getting-started)
- [Contributing →](/contributing)
