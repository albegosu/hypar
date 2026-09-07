# Hypar — Architecture

> Technical architecture derived from [DEFINITION.md](DEFINITION.md).
> Every decision here references a definition decision (D1–D31).
> Last updated: 2026-09-07.

---

## Current state summary

Hypar is a Nuxt 3 single-page application with:

- **Frontend**: Vue 3 + Nuxt UI v3 + Tailwind CSS v4 + `ai-elements-nuxt`
- **Backend**: Nitro/h3 server routes + Prisma 7 + PostgreSQL 16
- **Auth**: better-auth (email/password, optional OAuth)
- **LLM**: Ollama via Vercel AI SDK (`@ai-sdk/openai` pointed at Ollama's `/v1`)
- **State**: Pinia store (`stores/embryos.ts`)
- **Visual system**: Monochrome glass design system (`assets/css/main.css`)

The codebase already implements: embryo CRUD, lifecycle transitions, tensions, connections (typed), fossilization with reason, agent collaboration (streaming SSE, one question per turn), connection graph, and a pending-challenges queue. There are no background jobs, no multi-provider support, and no materialization pipeline.

---

## What survives

| Layer | Verdict | Notes |
|---|---|---|
| Nuxt 3 framework | **Keep** | Solid foundation, SSR + SPA, good for PWA |
| Prisma + PostgreSQL | **Keep** | Schema evolves (see below) |
| better-auth | **Keep** | Add discipline profile field to User |
| Pinia store | **Keep** | Extend for proposals inbox, prototypes |
| CSS design system | **Keep** | Mobile-first pass needed (D30) |
| `ai-elements-nuxt` | **Keep** | Subproduct, components evolve with hypar |
| Server middleware | **Keep** | Rate limiting, auth session, request ID |
| Embryo CRUD routes | **Keep** | Extend PATCH actions |
| Agent SSE endpoint | **Evolve** | Multi-mode agent, provider abstraction |
| Ollama provider | **Evolve** | Becomes one of N curated providers (D13) |

## What's new

| Capability | Definition ref | Status |
|---|---|---|
| Multi-format capture (text, URL, image) | D14, D26 | New |
| Seed atomicity enforcement | D15 | New |
| Proposal inbox | D19 | New |
| Origination chain tracking | D18 | New |
| Materialization pipeline + live preview | D8, D24 | New |
| Prototype storage + export | D12 | New |
| Provider abstraction (curated list) | D13 | New |
| Background jobs (time decay) | D10 | New |
| Discipline profiles | D21 | New |
| PWA + quick-capture | D14, D30 | New |

---

## Architecture layers

```
┌─────────────────────────────────────────────────┐
│                  Client (Vue 3)                 │
│  Pages · Components · Stores · Composables      │
│  PWA shell · Quick-capture · Live preview       │
├─────────────────────────────────────────────────┤
│               API Layer (Nitro/h3)              │
│  REST routes · SSE streaming · File upload      │
├─────────────────────────────────────────────────┤
│              Agent Orchestrator                 │
│  Mode router · Prompt assembly · Output parser  │
├─────────────────────────────────────────────────┤
│             Provider Abstraction                │
│  Vercel AI SDK · Provider registry · Model map  │
├──────────────┬──────────────────────────────────┤
│   Data Layer │        Background Jobs           │
│  Prisma ORM  │  Time decay · Inbox cleanup      │
│  PostgreSQL  │  (node-cron or Nitro tasks)      │
└──────────────┴──────────────────────────────────┘
```

---

## 1. Data model evolution

The current Prisma schema is the foundation. Changes below are additive — no existing tables are dropped.

### User: add discipline profile (D21)

```
model User {
  ...existing fields...
  discipline  Discipline  @default(DEVELOPER)
}

enum Discipline {
  DESIGNER
  DEVELOPER
  PRODUCT
}
```

### Embryo: add origin tracking and attachments (D2, D26)

```
model Embryo {
  ...existing fields...
  origin       EmbryoOrigin   @default(USER)
  chainDepth   Int            @default(0)        // D18: max 2 for model-originated
  attachments  Attachment[]
}

enum EmbryoOrigin {
  USER
  MODEL
}
```

### New: Attachment (D26)

```
model Attachment {
  id        String          @id @default(cuid())
  embryoId  String
  type      AttachmentType
  url       String          // stored file URL or external URL
  metadata  Json?           // dimensions, title, description extracted
  createdAt DateTime        @default(now())

  embryo    Embryo          @relation(fields: [embryoId], references: [id], onDelete: Cascade)
}

enum AttachmentType {
  URL
  IMAGE
}
```

### New: Proposal (D19)

Model proposals live in a separate inbox, not as embryos. They become embryos only when adopted.

```
model Proposal {
  id            String         @id @default(cuid())
  userId        String
  seed          String         // proposed seed text
  rationale     String         // why the agent proposed this
  sourceId      String?        // embryo that triggered this proposal
  chainDepth    Int            @default(1)
  status        ProposalStatus @default(PENDING)
  createdAt     DateTime       @default(now())
  adoptedAt     DateTime?
  adoptedAsId   String?        // embryo ID if adopted

  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  source        Embryo?        @relation("ProposalSource", fields: [sourceId], references: [id], onDelete: SetNull)

  @@index([userId, status])
}

enum ProposalStatus {
  PENDING
  ADOPTED
  DISMISSED
}
```

### New: Prototype (D8, D12, D24)

```
model Prototype {
  id        String   @id @default(cuid())
  embryoId  String
  version   Int      @default(1)
  html      String   // full HTML/CSS/JS content
  createdAt DateTime @default(now())

  embryo    Embryo   @relation(fields: [embryoId], references: [id], onDelete: Cascade)

  @@index([embryoId, version])
}
```

### AgentNoteType: drop PENDING_PATH (D29)

```
enum AgentNoteType {
  OBSERVATION
  PENDING_QUESTION
  PENDING_CONNECTION
  PENDING_FOSSIL
  // PENDING_PATH removed — paths are now separate embryos
}
```

### Relations to add on Embryo

```
model Embryo {
  ...existing...
  proposals    Proposal[]   @relation("ProposalSource")
  prototypes   Prototype[]
}

model User {
  ...existing...
  proposals    Proposal[]
}
```

---

## 2. Provider abstraction (D13)

The current setup uses `@ai-sdk/openai` pointed at Ollama. The Vercel AI SDK already supports multiple providers — the abstraction is mostly a registry and config layer.

### Provider registry

```
server/utils/providers/
  index.ts          // registry: getProvider(name) → LanguageModel
  ollama.ts         // current implementation, extracted
  anthropic.ts      // @ai-sdk/anthropic
  openai.ts         // @ai-sdk/openai (native, not Ollama compat)
```

Each provider module exports a factory:

```ts
// server/utils/providers/index.ts
const CURATED_PROVIDERS = ['ollama', 'anthropic', 'openai'] as const

export function getProvider(name: string): LanguageModelV1 {
  // validate against curated list
  // return configured provider instance
}
```

### Model selection

User selects from a curated list in settings. The `useLlmModel` composable already stores the selection in a cookie — extend it to include provider + model as a tuple.

The `/api/llm/models` endpoint evolves to return models grouped by provider, each with a capability tag (can it generate code? can it do structured output?).

---

## 3. Agent orchestrator (D9, D15, D20, D22, D23)

The current agent is a single-mode system: it receives an embryo and returns a question + optional structured proposals. The new agent needs multiple modes.

### Agent modes

| Mode | Trigger | Input | Output | Definition ref |
|---|---|---|---|---|
| **Challenge** | User opens embryo, replies | Embryo + context + discipline | Structured challenge card | D20 |
| **Atomicity check** | User plants a seed | Raw seed text | Accept or split proposal | D15 |
| **Originate** | New seed planted or state change | Triggering embryo + garden context | Proposal(s) for inbox | D9, D18 |
| **Connect** | During challenge, or on origination | Current embryo + peers + fossils | Connection proposals | D23 |
| **Redirect** | Out-of-scope seed detected | Raw seed text | Redirected seed suggestion | D22 |
| **Materialize** | User requests materialization | Embryo + conversation + prior prototype | HTML/CSS/JS code (streamed) | D8, D24 |
| **Extract seed** | URL or image input | URL content / image | Proposed seed text | D26 |
| **Maturity check** | Agent evaluates during challenge | Embryo + tensions + history | Maturity proposal or nothing | D17 |

### Prompt assembly

```
server/utils/agent/
  orchestrator.ts     // mode router: picks mode, assembles prompt, parses output
  modes/
    challenge.ts      // system prompt + output schema for challenges
    atomicity.ts      // seed split detection
    originate.ts      // new embryo proposals
    connect.ts        // connection detection (includes fossil surfacing)
    redirect.ts       // scope redirection
    materialize.ts    // HTML generation with iteration context
    extract-seed.ts   // URL/image → seed text
    maturity.ts       // maturity assessment
  context.ts          // builds context window: current embryo, peers, fossils, discipline
  discipline.ts       // discipline-specific prompt modifiers (D21)
```

### Context assembly (D23)

The current agent gets: current embryo + up to 15 living peers + 5 fossils. This survives, with changes:

- **Fossil surfacing is active**: the context builder checks fossils for relevance to the current embryo's seed and surfaces the most relevant ones, not just the most recent.
- **Discipline filter**: the discipline profile modifies the system prompt tone and vocabulary, not the data context.
- **Methodology signals**: the stance system (define/probe/variety/simplest per lifecycle state) is preserved and extended. The "this was applied" transparency signals (D4) are added to the agent's output schema.

### Output schema

Each mode returns a typed JSON structure. Example for Challenge mode:

```ts
interface ChallengeOutput {
  question: string
  move: 'DEFINE' | 'PROBE' | 'INVERT' | 'VARIETY' | 'SIMPLEST'
  methodology_signal?: string     // "This challenged your assumption about..." (D4)
  connections?: ConnectionProposal[]
  fossil_echo?: FossilReference   // relevant fossil surfaced (D23)
  maturity_proposal?: boolean     // agent thinks this is mature (D17)
  fossilization_proposal?: {      // agent thinks this should die (D31)
    reason: string
  }
}
```

---

## 4. Capture pipeline (D14, D15, D26)

The planting flow becomes a pipeline, not a single create call.

```
User input (text / URL / image)
    │
    ├─ text → atomicity check (agent mode)
    │         ├─ atomic → plant
    │         └─ compound → show split proposal → user confirms → plant N embryos with connections
    │
    ├─ URL → fetch metadata + extract seed (agent mode) → user confirms/edits → atomicity check → plant
    │        └─ store URL as Attachment
    │
    └─ image → upload + extract seed (agent mode) → user confirms/edits → atomicity check → plant
             └─ store image as Attachment
```

### API changes

```
POST /api/embryos/check-seed    // atomicity check, returns accept or split proposal
POST /api/embryos/extract-seed  // URL/image → proposed seed text
POST /api/embryos               // existing, extended with attachments
POST /api/upload                // image upload, returns stored URL
```

### After planting

When a seed is successfully planted (D9):

1. Agent origination mode fires asynchronously.
2. If proposals are generated, they go to the proposal inbox.
3. If `chainDepth < 2` and the embryo was adopted from a proposal, origination can chain.

---

## 5. Proposal inbox (D19)

### API

```
GET    /api/proposals            // list pending proposals for current user
POST   /api/proposals/:id/adopt  // adopt → creates embryo + DERIVES connection
POST   /api/proposals/:id/dismiss
```

### UI

A distinct section in the garden view — not mixed with living embryos. Shows: proposed seed, rationale, source embryo link. Actions: adopt (enters garden, counts toward cap) or dismiss.

### Volume

Proposals don't count against the volume cap (D19). However, the inbox itself should have a soft limit — if > 20 pending proposals, the oldest are auto-dismissed with a "inbox overflow" reason. This prevents the inbox from becoming its own stagnation problem.

---

## 6. Materialization pipeline (D8, D12, D24, D27)

### Flow

1. User clicks "Materialize" on an embryo (any state — D16).
2. Agent materialize mode fires, receiving: seed, all conversation history, tensions, connections, discipline.
3. First pass: agent generates an HTML/CSS/JS prototype, streamed via SSE.
4. Prototype is rendered live in a sandboxed `<iframe>` in the embryo detail view (D27, bottom/side zone).
5. A `Prototype` row is saved (version 1).
6. User replies with refinements ("slower transition", "try spring easing").
7. Agent receives prior prototype + refinement, generates updated code.
8. New `Prototype` row saved (version N+1). Live preview updates.
9. Repeat until the user is satisfied.

### Sandboxed preview

The prototype iframe uses `sandbox="allow-scripts"` — no network access, no navigation, no forms. The HTML content is injected via `srcdoc`. This is safe because:

- The prototype is agent-generated, not user-uploaded arbitrary HTML.
- The sandbox prevents any outbound requests.
- Each prototype is self-contained (no external dependencies beyond what's inlined).

### Export (D12)

```
GET /api/embryos/:id/prototype           // latest version HTML, rendered in-app
GET /api/embryos/:id/prototype/download   // triggers file download of standalone HTML
GET /api/embryos/:id/prototype/:version   // specific version
```

The exported file is a complete, self-contained HTML document with embedded CSS and JS.

---

## 7. Carrying capacity (D10)

### Time decay

A background job runs periodically (every hour) and checks:

- Embryos in `LATENT` state with no activity (no events) for > N days.
- For each, the agent fossilization mode fires and creates a `PENDING_FOSSIL` note.
- The user sees these on next visit. The user confirms or dismisses (D31).

### Volume cap

Enforced at the API level in `POST /api/embryos` (create) and `POST /api/proposals/:id/adopt`:

- Count living embryos (non-FOSSIL) for the current user.
- If >= cap, reject with a 409 and a message: "Your garden is at capacity. Fossilize or mature an embryo to make room."
- The cap is a server config value, not hardcoded. Starting point: 30 living embryos.

### Implementation

Nuxt 3 / Nitro supports scheduled tasks via `nitro.experimental.tasks` or a simple `node-cron` setup in a server plugin:

```
server/plugins/decay-scheduler.ts   // registers the cron job
server/tasks/time-decay.ts          // the decay check logic
```

---

## 8. Mobile-first PWA (D30)

### PWA setup

Add `@vite-pwa/nuxt` module:

- Service worker for offline shell caching.
- Web app manifest with Hypar branding.
- Install prompt on mobile browsers.

### Quick-capture

- **Share intent**: Register as a share target in the PWA manifest. When the user shares a URL or image to Hypar, it opens the capture pipeline directly.
- **Home screen widget**: Not possible with PWA alone — this is native app territory. Defer.
- **Keyboard shortcut**: On desktop, a global shortcut (configurable) opens a quick-capture overlay without navigating away from the current page.

### Responsive adaptation

The current CSS system uses a single-pane `hypar-frame` layout. Mobile-first changes:

- Garden view: single column, seed input sticky at top.
- Embryo detail: stacked zones (seed → thread → prototype), not side-by-side.
- Prototype preview: full-width below the thread on mobile, side panel on desktop.
- Float nav: bottom bar on mobile, float pill on desktop.

---

## 9. Onboarding (D21)

First-time flow after signup:

1. **Discipline picker**: "How do you think about digital products?" → Designer / Developer / Product thinker.
2. **First seed**: Prompt to plant their first idea. The garden opens with the capture field focused.

No other onboarding steps. The system teaches through use — the agent's first challenge is the tutorial.

---

## 10. API surface summary

### Existing (keep)

```
GET    /api/embryos
POST   /api/embryos
GET    /api/embryos/:id
PATCH  /api/embryos/:id          // add new actions: accept_maturity, request_materialize
POST   /api/embryos/:id/agent    // evolve to multi-mode
POST   /api/embryos/:id/fossilize
POST   /api/embryos/:id/resurrect
GET    /api/llm/models           // extend: grouped by provider
GET    /api/health
POST   /api/vitals
POST   /api/client-errors
GET    /api/auth/[...]
```

### New

```
POST   /api/embryos/check-seed          // atomicity check
POST   /api/embryos/extract-seed        // URL/image → seed proposal
POST   /api/upload                      // image upload
GET    /api/proposals                   // list pending proposals
POST   /api/proposals/:id/adopt         // adopt → create embryo
POST   /api/proposals/:id/dismiss       // dismiss proposal
GET    /api/embryos/:id/prototype       // latest prototype
GET    /api/embryos/:id/prototype/download  // export as file
GET    /api/embryos/:id/prototype/:version  // specific version
PATCH  /api/user/profile                // update discipline, preferences
```

---

## Implementation order

The definition is complete. The architecture above describes the target state. Implementation should be phased to deliver value incrementally while building toward the full vision.

### Phase 1: Foundation alignment

Align the existing codebase with DEFINITION.md without adding new features.

1. Drop `PENDING_PATH` from AgentNoteType (D29).
2. Add `Discipline` enum and field to User (D21).
3. Add `EmbryoOrigin` enum and `origin` field to Embryo (D2).
4. Mobile-first CSS pass on existing views (D30).
5. Onboarding flow: discipline picker on first login (D21).

### Phase 2: Provider abstraction + agent modes

Make the agent pluggable and multi-modal.

1. Extract provider registry from current Ollama-only setup (D13).
2. Add at least one non-Ollama provider (Anthropic or OpenAI).
3. Refactor agent endpoint into mode router (challenge mode first).
4. Add methodology transparency signals to challenge output (D4).
5. Add fossil surfacing to challenge context (D23).
6. Settings page: provider + model selection.

### Phase 3: Capture pipeline

Multi-format input with atomicity enforcement.

1. Atomicity check endpoint + UI flow (D15).
2. URL extraction endpoint + attachment model (D26).
3. Image upload + extraction endpoint (D26).
4. Scope redirection in agent (D22).

### Phase 4: Proposal inbox + origination

The model as co-gardener.

1. Proposal data model + API (D19).
2. Agent origination mode (D9).
3. Chain depth tracking (D18).
4. Proposal inbox UI in garden view.
5. Fossilization proposals from agent (D31).

### Phase 5: Materialization

From idea to artifact.

1. Prototype data model + API (D8).
2. Agent materialize mode (D24).
3. Sandboxed live preview in embryo detail (D27).
4. Iterative refinement loop.
5. Export/download endpoint (D12).

### Phase 6: Carrying capacity + PWA

Pressure mechanisms and mobile capture.

1. Volume cap enforcement at API level (D10).
2. Time decay background job (D10).
3. PWA manifest + service worker (D30).
4. Share target registration for quick-capture (D14).

---

## File structure target

```
hypar/
├── prisma/schema.prisma                    # evolved schema
├── server/
│   ├── api/
│   │   ├── embryos/                        # existing + check-seed, extract-seed
│   │   ├── proposals/                      # new: inbox CRUD
│   │   ├── upload.post.ts                  # new: image upload
│   │   ├── llm/models.get.ts              # evolved: multi-provider
│   │   └── user/profile.patch.ts          # new: discipline
│   ├── utils/
│   │   ├── providers/                      # new: provider registry
│   │   │   ├── index.ts
│   │   │   ├── ollama.ts
│   │   │   ├── anthropic.ts
│   │   │   └── openai.ts
│   │   ├── agent/                          # new: agent orchestrator
│   │   │   ├── orchestrator.ts
│   │   │   ├── context.ts
│   │   │   ├── discipline.ts
│   │   │   └── modes/
│   │   │       ├── challenge.ts
│   │   │       ├── atomicity.ts
│   │   │       ├── originate.ts
│   │   │       ├── connect.ts
│   │   │       ├── redirect.ts
│   │   │       ├── materialize.ts
│   │   │       ├── extract-seed.ts
│   │   │       └── maturity.ts
│   │   ├── prisma.ts
│   │   └── ...existing utils
│   ├── plugins/
│   │   └── decay-scheduler.ts              # new: time decay cron
│   └── tasks/
│       └── time-decay.ts                   # new: decay check logic
├── stores/
│   ├── embryos.ts                          # evolved
│   └── proposals.ts                        # new
├── pages/
│   ├── index.vue                           # evolved: mobile-first + inbox section
│   ├── embryo/[id].vue                     # evolved: prototype zone
│   ├── settings.vue                        # evolved: provider picker, discipline
│   └── ...existing
├── components/
│   ├── embryo/
│   │   ├── AgentCollaborate.vue            # evolved: multi-mode
│   │   ├── ConnectionGraph.vue             # keep
│   │   ├── PrototypePreview.vue            # new: sandboxed iframe
│   │   └── SeedCapture.vue                 # new: multi-format input
│   ├── garden/
│   │   ├── PendingQueue.vue                # keep
│   │   └── ProposalInbox.vue               # new
│   └── ...existing
├── composables/
│   ├── useLlmModel.ts                      # evolved: provider + model tuple
│   └── ...existing
├── DEFINITION.md
├── ARCHITECTURE.md
└── ...existing config
```

---

## Principles

1. **Additive over destructive.** The existing codebase is functional. New features are added alongside, not as rewrites.
2. **Each phase ships standalone value.** No phase depends on a later phase to be useful.
3. **Agent quality is the product.** The provider and prompt layers get the most architectural care because the agent's output IS the user experience.
4. **Mobile-first is a CSS discipline, not a rewrite.** The Nuxt app serves both. No separate mobile app.
5. **Background jobs are minimal.** Only time decay needs a scheduler. Everything else is request-driven.
