# Hypar — Product Definition

> Living document. Every section is a decision or an open question.
> Nothing here is aspirational unless explicitly marked `[OPEN]`.
> Last updated: 2026-09-07.

---

## What Hypar is

Hypar is an **intelligent idea laboratory for digital product people** — designers, developers, and product thinkers who work on UI/UX and digital experiences.

It is a place where you plant raw ideas (a hover interaction, a navigation pattern, a micro-animation concept), and the system helps you **define, challenge, connect, and materialize** them — from a one-sentence seed to something you can show: a refined description or a working HTML prototype. Validation is not a separate step — it is the outcome of surviving challenges, resolving tensions, and optionally materializing into a prototype that proves the concept works.

The lab is personal but shareable. You own your garden; you can open it to others.

**Capture is instant.** An idea can be born from text, an external link, or a screenshot/image. Inside the app, the garden opens with a text field front and center — one tap, type, enter. Outside the app, a quick-capture shortcut (keyboard shortcut, mobile widget, share intent) lets you plant a seed without navigating to the garden first.

## What Hypar is not

- A general-purpose note-taking app or second brain.
- A chatbot or conversational AI product.
- A project management tool.
- A design tool (Figma, Framer). It precedes and feeds those tools.
- A code playground (CodePen, StackBlitz). It can produce code artifacts, but the value is the thinking process that leads to them, not the editor.

## The problem it solves

Ideas for digital products die in three ways:

1. **Evaporation.** You think of something on the street, jot it on a note, and never revisit it. No structure forces you back.
2. **Isolation.** Each idea lives alone. You don't see that your hover idea contradicts your navigation idea, or that three separate thoughts are really one pattern.
3. **Stagnation.** The idea stays as text forever. There's no path from "what if the card previewed on hover" to a testable artifact that proves or disproves the concept.

Hypar attacks all three by giving ideas a **lifecycle with pressure** — a system that doesn't let ideas rest comfortably, that forces definition, challenges assumptions, surfaces connections, and pushes toward tangible output.

## Core domain

**Sector:** Digital products — UI/UX, interaction design, frontend patterns, micro-interactions, design systems, product features.

**User:** Someone who thinks about digital products professionally or seriously. They have ideas constantly. They currently lose most of them or keep them in scattered notes without structure.

**Scope boundary:** Hypar is not for every kind of idea. A business model canvas or a marketing campaign strategy is out of scope. If the idea can't eventually be expressed as a UI, an interaction, a component, or a digital experience, it doesn't belong here.

---

## Core concepts

### The Embryo

The unit of thought. Not a note, not a task, not a ticket. A living entity with a lifecycle.

- **Seed**: One sentence capturing one atomic concept. Immutable after creation. The constraint is intentional — if you can't say it in one sentence, it's not one idea. **The system enforces atomicity**: if the agent detects multiple concepts in a seed ("a card that on hover shows a preview with position-aware transition"), it splits them before planting and the user confirms the split. A seed can originate from text, a URL, or an image — when the input is non-text, the agent analyzes it and proposes a one-sentence seed that the user confirms or rewrites before planting. The original URL/image is stored as an attachment alongside the seed.
- **Tensions**: Open questions within an embryo that demand resolution. Raised by the agent ("Does this work on touch devices?") or by the user. A tension is not a comment — it stays visible and unresolved until someone answers it with a resolution. Tensions are the pressure mechanism that prevents ideas from resting comfortably. Agent challenges create tensions directly — the challenge IS a tension, not a separate concept.
- **Lifecycle**: `LATENT → GERMINATING → GROWING → MATURE → FOSSIL`. The state shapes the agent's behavior (what kind of challenge it poses, what methodology stance it applies) but does not gate the user's actions. All actions are available in all states — the lifecycle is soft guidance, not a permissions system.
- **Maturity**: An embryo becomes MATURE when the agent proposes it and the user confirms. The user can also declare maturity directly. There is no automatic promotion.
- **Fossilization**: Same pattern as maturity — the agent proposes fossilization (including from time decay pressure), the user confirms. The user can also fossilize directly. A fossil requires a reason and a kind. **Fossil kinds include negative outcomes (ill-defined, wrong path, superseded) and positive ones (completed, shipped).** A mature embryo that has produced its prototype and resolved its tensions can be fossilized as COMPLETED — graduation, not death. This frees volume cap space and moves the idea to the strata as a trophy, not a tombstone. The graveyard teaches — the agent proactively surfaces relevant fossils when you work on a new embryo ("You explored something similar 3 months ago and fossilized it because X"), and the strata view is always browsable. RESURRECTS connections are the formal mechanism for reviving a fossilized line of thought.

### The Garden

Your collection of embryos. A personal workspace with spatial or structured navigation. The garden has two layers:

- **Surface**: Living embryos, organized by activity and tension.
- **Strata**: Fossils, organized by time. Excavation, not browsing.

### Two tracks: User / Model

Every idea and action in the garden has clear authorship:

- **Your track**: Ideas you planted, connections you drew, decisions you made.
- **Model track**: Ideas the model originated, connections it inferred, challenges it posed.

This distinction is permanent and visible. The model can originate ideas (not just respond to yours), but the user always sees what came from where. Model-originated embryos live in a **separate proposal inbox** — they do not count against the garden's volume cap and do not appear on the living surface until the user explicitly adopts them. Adopted proposals become regular embryos (marked as model-originated) and count toward the cap.

**Origination chaining**: an adopted model proposal can trigger one more round of agent origination, but chains never go deeper than two levels. This allows emergent discovery without runaway loops.

### The Embryo detail view

When you open an embryo, the view is structured in three zones:

1. **Seed** (top) — The immutable one-sentence idea, its state badge, its origin (user/model), and any attachments (URL, image).
2. **Agent thread** (middle) — The structured interaction: challenge cards, tension cards, connection proposals, enrichment notes, and the user's free-text replies. This is the conversation about the idea, not a chat.
3. **Prototype preview** (bottom/side) — When materializing, the live HTML preview renders here. During iteration, it updates as the conversation evolves.

### The Agent role

The agent is a **collaborator with a critical stance**, not an assistant. Its behaviors:

| Behavior | Description | Attribution |
|---|---|---|
| **Challenge** | Questions your idea's assumptions, feasibility, originality | Model track |
| **Connect** | Detects relationships between embryos (reinforces, contradicts, extends) | Model track (unconfirmed until user accepts) |
| **Enrich** | Adds context, references, technical considerations | Model track |
| **Originate** | Proposes new embryos when triggered by a new seed or a state change — contextual, not scheduled | Model track (proposed, requires user adoption) |
| **Materialize** | Helps push an idea toward a tangible artifact (description, visual, prototype) | Collaborative |

The agent does NOT: validate without questioning, summarize without adding, or comfort. Tension is the product.

**Interaction model**: Hybrid. The agent's primary output is structured — challenge cards, connection proposals, prototype iterations. But the user can reply in free text to push back, redirect, or ask for more. This is not a chat: the structure keeps the conversation productive, and free text keeps it human.

**Agent persona**: The user picks a discipline profile during onboarding (designer, developer, product thinker). The agent adapts its challenge vocabulary, technical depth, and materialization style to the profile. A developer gets "this needs requestAnimationFrame, not CSS transitions, because..." A designer gets "the visual weight shifts the hierarchy away from the primary action."

**Scope enforcement**: The agent does not reject out-of-scope ideas. It redirects them toward their UI/UX surface. "API rate limiting strategy" becomes "How does rate limiting surface to the user? What does the error state look like?" Every idea has a user-facing angle; the agent finds it.

### Materialization

The path from idea to artifact. This is what separates Hypar from a thinking tool and makes it a lab:

1. **Text** — A refined description synthesized from the seed and agent thread: what the idea does, why it matters, where it applies, what tensions it resolved. Generated by the agent on demand from the accumulated conversation, not manually written.
2. **Prototype** — A working HTML/CSS/JS artifact that demonstrates the interaction or pattern. The browser is the canvas: looping CSS animations, interactive hover states, transition sequences, layout experiments — all achievable without image generation.

**Process**: Materialization is iterative with live preview. The user and agent go back and forth — "slower transition", "darker background", "try it with a spring easing" — and the prototype renders live in Hypar as the conversation evolves. The user sees changes in real time, not after each round-trip.

Not every embryo reaches materialization. Many should die as fossils. But the path must exist and be smooth for the ideas that earn it.

### Methodology as substrate

Design methodologies (lean validation, Munari's method, design thinking, heuristic evaluation) are **built into the system's behavior**, not shown as a framework the user must follow.

How they surface:

- **Internally**: The agent's prompts, the lifecycle transitions, and the connection logic are informed by these methods. The system applies them.
- **To the user**: As contextual signals — "This was applied: the question challenged your assumption about user intent (probe phase)" or "Suggested: define the constraints before exploring solutions." Never as mandatory steps. Never as a visible methodology stepper.

The user benefits from the methods without studying them. The system is opinionated about process but transparent about what it's doing.

### The network

Embryos don't exist alone. The system maintains a graph of connections:

- **REINFORCES** — Two ideas support the same thesis.
- **CONTRADICTS** — Two ideas are in tension (this is valuable, not a problem).
- **EXTENDS** — One idea builds on another.
- **RESURRECTS** — A new idea revives a fossilized one.
- **DERIVES** — A model-originated idea was born from an existing one.

Connections can be user-drawn or model-inferred. Model-inferred connections are visually distinct and require confirmation.

`[OPEN]` Whether the network extends beyond a single garden (can the system find connections to public ideas from other users' shared gardens?) is deferred until multi-user is real.

---

## User model

### Single user (current)

One garden per user. Full ownership. The agent knows only your embryos.

### Multi-user (designed for, not built yet)

- **Private garden**: Default. Only you see it.
- **Shared garden**: You can open your garden (or specific embryos) for others to see, comment on, or fork.
- **Forking**: Taking someone else's embryo into your own garden as a new seed, with provenance.

`[OPEN]` Whether shared gardens allow collaborative editing or are read-only-with-fork is a product decision that depends on how authorship and agent context work in a multi-user setting.

---

## What the agent needs to be good at this

The agent must be domain-aware for digital products and UI/UX. This means:

1. **Technical literacy**: Knows what's feasible in CSS, JS, modern frameworks. Can assess "is this interaction buildable" and "what are the performance implications."
2. **Design literacy**: Understands visual hierarchy, affordances, Gestalt principles, accessibility. Can challenge an idea on usability grounds, not just aesthetics.
3. **Pattern awareness**: Knows established UI patterns and can identify when an idea is novel vs. a reinvention. References prior art without being dismissive.
4. **Materialization capability**: Can generate HTML/CSS/JS prototypes that demonstrate an interaction concept. Not production code — proof-of-concept quality.

This implies the system prompt, the agent's context window, and potentially a curated knowledge base are tuned for this domain. A generic LLM call is not enough.

---

## Decisions taken

| # | Decision | Rationale |
|---|---|---|
| D1 | Domain is digital products and UI/UX | Unbounded idea gardens can't validate anything. A domain gives evaluation criteria. |
| D2 | Two-track attribution (User / Model) | The user must always know what's theirs and what's suggested. Trust requires transparency. |
| D3 | Agent can originate ideas, as proposals | The garden grows better with two gardeners. But the owner decides what lives. |
| D4 | Methodologies are substrate, not UI | Users don't want to learn Munari. They want better ideas. Methods serve silently. |
| D5 | Materialization is a first-class path | A lab that only produces text is a notebook. The lab must produce testable artifacts. |
| D6 | Scope boundary: if it can't be UI/interaction/digital experience, it's out | Prevents the garden from becoming a second brain for everything. |
| D7 | Documentation in English | Broader reach, technical standard. |
| D8 | Materialization MVP is text + HTML/CSS/JS | HTML can produce looping animations, interactive demos, and visual proofs of concept. No image generation needed — the browser is the canvas. Keeps the pipeline simple and the output runnable. |
| D9 | Model origination is event-driven | The agent proposes new ideas when the user plants a seed or when an embryo changes state — not on a schedule, not on demand. This keeps origination contextual and non-intrusive: the model reacts to momentum, not to silence. |
| D10 | Carrying capacity: time decay + volume cap | Two pressures prevent garden bloat. **Time decay**: embryos that stay LATENT beyond a threshold trigger agent-proposed fossilization. **Volume cap**: a maximum number of living embryos forces the user to decide — grow or fossilize — before planting more. The exact thresholds are tuning parameters, not product decisions. |
| D11 | Agent knowledge: training first, curated DB later | Start with the LLM's built-in UI/UX knowledge. If answers prove too generic or outdated, add a searchable pattern database as a second phase. Avoids premature infrastructure. |
| D12 | Prototypes are viewable in Hypar and exportable | The prototype lives inside the lab (embedded preview) but the user can download it as a standalone HTML file to share, present, or embed elsewhere. The lab is not a walled garden for its own output. |
| D13 | Curated provider list | Hypar supports 2–3 proven LLM providers that meet the quality floor for design reasoning, code generation, and critical challenge. Not any model — the agent's quality is the product, and weak models undermine it. |
| D14 | Capture is multi-format and instant | Seeds can originate from text, URLs, or images. The garden has an always-visible field; outside the app, quick-capture (shortcut, widget, share intent) skips navigation. Solving evaporation requires zero-friction entry. |
| D15 | Seeds are atomic — system enforces | If the agent detects multiple concepts in a seed, it proposes a split before planting. The user confirms the split. Compound ideas become connected embryos, not one overloaded seed. |
| D16 | Lifecycle is soft guidance, not permissions | The state shapes the agent's behavior (challenge style, methodology stance) but never gates user actions. No "you can't materialize until MATURE." |
| D17 | Maturity is agent-proposed, user-confirmed | The agent suggests when an embryo looks mature. The user can also declare it directly. No automatic promotion — maturity is a human decision. |
| D18 | Origination chains max depth 2 | An adopted model proposal can trigger one more origination round, but never deeper. Balances emergent discovery against runaway feedback loops. |
| D19 | Model proposals live in a separate inbox | Proposals don't count against the volume cap and don't appear on the garden surface until adopted. The model can't flood your garden or block your own planting. |
| D20 | Interaction is hybrid: structured + free text | The agent outputs structured cards (challenges, proposals, prototypes). The user can reply in free text. Not a chat, not a form — structured enough to be productive, open enough to be human. |
| D21 | User picks a discipline profile | Onboarding asks: designer, developer, or product thinker. The agent adapts challenges, vocabulary, and materialization style accordingly. |
| D22 | Scope enforcement is redirection, not rejection | Out-of-scope ideas are steered toward their UI/UX surface, not refused. Every idea has a user-facing angle. |
| D23 | Fossils are proactively surfaced | The agent connects new work to relevant fossils ("You tried this before and fossilized it because X"). Plus manual strata browsing. RESURRECTS is the formal mechanism. |
| D24 | Materialization is iterative with live preview | The user and agent refine the prototype conversationally. The prototype renders live in Hypar during iteration, not after each round-trip. |
| D25 | Architecture supports future integrations | No integrations in MVP, but the architecture (API, webhooks) is designed so Figma, GitHub, and other tool connections are addable without rearchitecture. |
| D26 | Non-text seeds: agent extracts, user confirms | URLs and images are analyzed by the agent, which proposes a one-sentence seed. The user confirms or rewrites. The original input stays as an attachment. The seed is always text. |
| D27 | Embryo detail: seed + thread + prototype | Three-zone layout. Top: immutable seed. Middle: structured agent thread. Bottom/side: live prototype preview during materialization. |
| D28 | Tensions are a first-class concept; agent challenges ARE tensions | Open questions within an embryo that demand resolution. Agent challenges create tensions directly — no separate "pending question" concept. Tensions carry a resolution when answered. |
| D29 | Paths are dropped — use connected embryos instead | Alternative directions are better expressed as separate embryos linked by CONTRADICTS or EXTENDS. Each path gets its own lifecycle and can independently mature or die. |
| D30 | Mobile-first | Designed for phone. Desktop is a larger canvas for the same experience. Capture on the go is the core use case — the street idea must reach the garden instantly. |
| D31 | Fossilization: agent proposes, user confirms | Same HITL pattern as maturity (D17). Time decay triggers proposal, not auto-fossilization. The user always decides what dies. |
| D32 | Fossil kinds include positive outcomes | COMPLETED and SHIPPED are valid fossil kinds alongside ill-defined, wrong-path, superseded. Fossilization is not only death — it is also graduation. This solves the MATURE cap-blocking problem: successful ideas fossilize as trophies, freeing volume. |
| D33 | Validation is implicit, not a discrete step | Validation = surviving challenges + resolving tensions + optionally materializing. No separate "validate" action. The process IS the validation. |
| D34 | Agent challenges create tensions, not notes | No separate "pending question" concept. When the agent challenges, it creates a Tension (raisedBy: AGENT). The user resolves it with a text answer. Simplifies the model and makes every challenge a pressure point. |

## Open questions

| # | Question | Stakes |
|---|---|---|
| O4 | What does "shared garden" mean in practice? Read-only showcase? Forkable? Collaborative? | Determines auth, permissions, and data model changes. Deferred to post-MVP. |

---

## Next: Architecture

This definition must be stable before architecture decisions are made. The architecture document (`ARCHITECTURE.md`) will follow and will reference this file for every "why."

The sequence is:
1. **DEFINITION.md** — What and why (this document)
2. **ARCHITECTURE.md** — How the system is structured to deliver the what
3. **Code** — Implementation of the architecture

No code without architecture. No architecture without definition.
