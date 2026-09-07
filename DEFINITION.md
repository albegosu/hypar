# Hypar — Product Definition

> Living document. Every section is a decision or an open question.
> Nothing here is aspirational unless explicitly marked `[OPEN]`.
> Last updated: 2026-09-07.

---

## What Hypar is

Hypar is an **intelligent idea laboratory for digital product people** — designers, developers, and product thinkers who work on UI/UX and digital experiences.

It is a place where you plant raw ideas (a hover interaction, a navigation pattern, a micro-animation concept), and the system helps you **define, challenge, connect, validate, and materialize** them — from a one-sentence seed to something you can show: a description, a visual reference, or a working HTML prototype.

The lab is personal but shareable. You own your garden; you can open it to others.

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

- **Seed**: One sentence capturing the raw idea. Immutable after creation. The constraint is intentional — if you can't say it in one sentence, it's not one idea.
- **Lifecycle**: `LATENT → GERMINATING → GROWING → MATURE → FOSSIL`
- **No delete**: Dead ideas are fossilized with a reason, never erased. The graveyard teaches.

### The Garden

Your collection of embryos. A personal workspace with spatial or structured navigation. The garden has two layers:

- **Surface**: Living embryos, organized by activity and tension.
- **Strata**: Fossils, organized by time. Excavation, not browsing.

### Two tracks: User / Model

Every idea and action in the garden has clear authorship:

- **Your track**: Ideas you planted, connections you drew, decisions you made.
- **Model track**: Ideas the model originated, connections it inferred, challenges it posed.

This distinction is permanent and visible. The model can originate ideas (not just respond to yours), but the user always sees what came from where. Model-originated embryos require explicit user acknowledgment before they become part of the garden's living surface — they arrive as proposals, not facts.

### The Agent role

The agent is a **collaborator with a critical stance**, not an assistant. Its behaviors:

| Behavior | Description | Attribution |
|---|---|---|
| **Challenge** | Questions your idea's assumptions, feasibility, originality | Model track |
| **Connect** | Detects relationships between embryos (reinforces, contradicts, extends) | Model track (unconfirmed until user accepts) |
| **Enrich** | Adds context, references, technical considerations | Model track |
| **Originate** | Proposes new embryos derived from existing ones or from gaps it identifies | Model track (proposed, requires user adoption) |
| **Materialize** | Helps push an idea toward a tangible artifact (description, visual, prototype) | Collaborative |

The agent does NOT: validate without questioning, summarize without adding, or comfort. Tension is the product.

### Materialization

The path from idea to artifact. This is what separates Hypar from a thinking tool and makes it a lab:

1. **Text** — A refined description of the idea: what it does, why it matters, where it applies.
2. **Visual reference** — An image, sketch, or mood reference that anchors the concept visually.
3. **Prototype** — A working HTML/CSS/JS artifact that demonstrates the interaction or pattern.

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

## Open questions

| # | Question | Stakes |
|---|---|---|
| O1 | What is the minimum viable materialization? Just HTML, or also images/sketches? | Determines the first artifact pipeline to build. |
| O2 | How does the model originate ideas? Scheduled sweeps, event-driven, or on explicit "surprise me"? | Defines the agent's autonomy model and the UX for model-track proposals. |
| O3 | How much domain knowledge does the agent carry vs. retrieve? | Affects architecture: system prompt tuning vs. RAG over a UI pattern corpus vs. tool use. |
| O4 | What does "shared garden" mean in practice? Read-only showcase? Forkable? Collaborative? | Determines auth, permissions, and data model changes. |
| O5 | Is there a "harvest" concept — a mature embryo that graduated from the lab into a real project? | Closes the loop between ideation and execution. Might be out of scope. |
| O6 | Provider flexibility — should the lab work with any LLM, or is the agent quality tightly coupled to a specific model? | Ollama is current; quality for origination and materialization may demand stronger models. |
| O7 | What prevents the garden from growing endlessly without pressure? Is there a carrying capacity? | Without constraint, the garden becomes a graveyard of latent seeds nobody revisits. |

---

## Next: Architecture

This definition must be stable before architecture decisions are made. The architecture document (`ARCHITECTURE.md`) will follow and will reference this file for every "why."

The sequence is:
1. **DEFINITION.md** — What and why (this document)
2. **ARCHITECTURE.md** — How the system is structured to deliver the what
3. **Code** — Implementation of the architecture

No code without architecture. No architecture without definition.
