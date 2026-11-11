---
status: proposed
date: 2026-11-11
---

# ADR 0009: Lifecycle semantics — GROWING vs MATURING, and what a transplant needs

- **Status:** proposed (draft for the maintainer; not binding)
- **Date:** 2026-11-11
- **Extends:** [ADR 0005 — TRANSPLANTED and MATURING](./0005-transplanted-and-maturing)
- **Resolves:** the first item of [Direction](/direction) "Still to define" (issue #190)

> Everything below is a **proposal**. Product decisions belong to the maintainer. Nothing here is runtime today; [the lifecycle concept page](/concepts/lifecycle) still describes current behaviour.

## Context

Today the two boundaries are undefined in practice:

- **GROWING vs MATURING.** The agent only advances `LATENT → GERMINATING` (first engage). Every other living transition is a free user jump with no adjacency graph ([lifecycle](/concepts/lifecycle)). The only difference between the two states is the agent stance in `utils/embryo-method.ts`: `GROWING` = `VARIETY` (open paths, pick no winner), `MATURING` = `VALIDATE` (evidence or the cheapest killing experiment; may propose fossil or transplant). Nothing observable says when an idea is ready to move from one to the other.
- **Transplant.** [ADR 0005](./0005-transplanted-and-maturing) requires only a non-empty `reason` and a non-empty `outcome` (free text, up to 2000 chars; `transplantGuard` only checks state is `MATURING`). Nothing separates "it works and is in use" from "I typed a link". The agent proposal is driven by the user saying it works (stance text), not by evidence.

Constraints that any answer must respect: the human decides every transition ([Direction](/direction)); one question per turn ([ADR 0002](./0002-agent-one-question)); no delete ([ADR 0003](./0003-no-delete-fossils)); validation depends on context (idea, solution, end user) and the validation plan is still direction, not runtime. Issues #191 (validation plan), #193 (critic) and #195 (experiments) build on this ADR.

## Decision (proposed)

### 1. GROWING vs MATURING

**`GROWING` means "the problem is named and the paths are open". `MATURING` means "one path is chosen and the work is testing it".** The boundary is the **choice of a path**, which is exactly where the stance flips from variety to validation.

**Readiness signals for `GROWING → MATURING`.** Defined so that each is observable from data the app already stores or the validation plan (#191) will store. All are **signals, not gates**.

| Id | Signal | Observable as |
|---|---|---|
| R1 | A direction is chosen | The user has kept one path (or written one direction) and no `PENDING_PATH` note is open |
| R2 | The problem is stated | The embryo has gone through `GERMINATING` and its root problem is resolved: no unresolved tension labelled as the problem/assumption it rests on |
| R3 | A falsifiable test exists | At least one validation-plan item (#191) states what would prove or kill the idea. Until #191 ships, a user note of that kind counts |

Rule of thumb for #193: the critic may emit a `ready-to-mature` suggestion with confidence when R1 and R3 hold, and must say which signals are missing otherwise.

**Who advances.** The **user**, always. The agent or critic may **propose** the move as an additive HITL note (like path, fossil and transplant proposals), never as a second question and never by changing state. The missing signals are shown next to the proposal. A user can still jump with signals missing, and can move back from `MATURING` to `GROWING` freely (unchanged). No signal blocks the PATCH.

**Concrete effect on the agent.** Unchanged stances. One addition: while `GROWING`, once R1 and R3 hold, the proposal note is allowed; the question itself stays a `VARIETY` question.

### 2. What a transplant requires

Builds on ADR 0005 (`MATURING` only, user confirms, agent may propose). Three **hard requirements** checked at the API (user-facing error, same style as today):

| Field | Requirement | Why |
|---|---|---|
| `outcome` | A **reference to something outside the garden**: a URL, or `kind: ref` where kind is one of component, doc, repo, skill, other | Separates "lives outside" from a note to self. Free-text-only becomes invalid |
| `reason` | Non-empty: why it worked (unchanged) | Success counterpart to the fossil reason |
| `evidence` (new) | Non-empty: **what was observed** that shows it works, with a source (a URL, or the id of an experiment or validation-plan result in the embryo) | Makes "it works" accountable; keeps transplant from being a vibe |

**Entry condition** (soft, shown not enforced): at least one validation-plan result or user evidence note recorded while the embryo was `MATURING`. If absent, the confirm dialog says "no validation recorded" and still allows the transplant, because validation can happen outside hypar (see Direction: validation depends on context).

**Quality is advisory.** The critic (#193) may attach a confidence and a short challenge to a transplant proposal ("evidence is one anecdote"). It never blocks. Nothing is judged by a model alone.

**Unchanged from ADR 0005:** terminal, closed to agent turns (`409`), only user notes allowed afterwards, artefact itself is not stored, nothing deleted.

## Alternatives rejected

| Option | Why rejected |
|---|---|
| **A. Keep it all free (status quo)** | No shared vocabulary; #191, #193 and #195 have nothing concrete to reference; transplant stays a link in a text box |
| **B. Hard gates (cannot enter `MATURING` until R1–R3 hold)** | Breaks "the human decides every transition". Ideas vary (a personal idea may have no testable claim), so a gate would be gamed with filler text |
| **C. Agent auto-advances on signals** | Same objection; also silent state changes erode trust in the lifecycle (cf. the explicit germination moment) |
| **D. Time or turn-count thresholds (N turns in `GROWING`)** | Measures effort, not readiness; trivially gamed and meaningless across idea types |
| **E. Merge `GROWING` and `MATURING`** | Loses the stance change (variety vs validation) that ADR 0005 and the method rely on |
| **F. Transplant requires an external signal (merged PR, users, revenue)** | Too tied to product ideas; hypar accepts any idea. Kept as an optional evidence kind, not a rule |
| **G. Store the artefact (snapshot) on transplant** | Out of scope in ADR 0005; storage and staleness cost with no decision value |

## Consequences

- If accepted, build work: `evidence` column on `Embryo` (migration), stricter `outcome` validation in `transplant.post.ts`, a readiness-signal note type, copy and stance tweaks in `utils/embryo-method.ts`, tests and evals. Then update [lifecycle](/concepts/lifecycle), [fossils](/concepts/fossils) concepts, AGENTS.md and Direction.
- The proposal changes the line "the agent does not suggest other lifecycle transitions" on the lifecycle page: a `GROWING → MATURING` proposal would be allowed, additive and HITL.
- Existing transplanted embryos (if any) have no `evidence`; the field must be nullable and only required for new transplants.
- #191: validation-plan items need a state (open, proven, killed) to make R3 and the evidence source referenceable.
- #193: critic output type `ready-to-mature` with `missing: R1|R2|R3[]` and a confidence.
- #195: experiments recorded in hypar are valid evidence sources, referenced by id.

## Open questions for the maintainer

1. Is **choosing a path** the right line between `GROWING` and `MATURING`, or should the line be "problem confirmed with evidence" (earlier) or "test running" (later)?
2. Should the agent be allowed a `GROWING → MATURING` proposal at all (this relaxes the current "agent suggests no transitions" rule), or should the readiness list be passive UI only?
3. R2 has no clean observable today (tensions are not typed as "the problem"). Drop R2 until #191 exists, or add a typed marker?
4. Should `evidence` be **required** (proposed) or optional with a warning? Required is stricter for ideas whose proof lives only in the user's head.
5. Outcome format: free URL or reference, or the structured `kind: ref` proposed here? Is a short list of kinds (component, doc, repo, skill, other) enough?
6. Is the soft entry condition ("a validation result recorded while `MATURING`") right, or should it be a hard rule for transplant?
7. Backward moves: should going `MATURING → GROWING` after a proposal clear that proposal, or leave it until the user dismisses it?
8. Should the garden show missing readiness signals on cards, or only inside the embryo detail (the "no methods UI" non-goal argues for the latter)?

## Sources

- [Direction](/direction) — "Still to define"
- [ADR 0005](./0005-transplanted-and-maturing), [ADR 0003](./0003-no-delete-fossils), [ADR 0002](./0002-agent-one-question), [ADR 0006](./0006-agent-roles-one-voice)
- [Lifecycle concept](/concepts/lifecycle)
- `utils/embryo-method.ts` (stances), `utils/embryo-lab.ts` (`transplantGuard`), `server/api/embryos/[id]/transplant.post.ts`, `prisma/schema.prisma` (`transplantReason`, `transplantOutcome`)
