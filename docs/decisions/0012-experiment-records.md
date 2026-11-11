---
status: proposed
date: 2026-11-12
---

# ADR 0012: Experiment records inside the idea

- **Status:** proposed
- **Date:** 2026-11-12
- **Extends:** [ADR 0003 — No-delete fossils](./0003-no-delete-fossils), [ADR 0005 — TRANSPLANTED and MATURING](./0005-transplanted-and-maturing)

## Context

The [2026-11 redefinition](/direction) dropped *"not a tracker of experiments"*: validation may record experiments when the context asks for it. Today an idea can hold tensions and web findings, but not the experiments run to validate it, with their result and evidence. The validation plan (issue #191) and a transplant's outcome both need that record. hypar must not become a tracker: no boards, owners, schedules or dashboards.

## Decision

An embryo holds **experiment records**: a small, append-style log of what was tried to validate it.

**Data model** (`Experiment`, one embryo has many):

| Field | Meaning |
|---|---|
| `hypothesis`, `method` | Required text, set at creation, never edited |
| `status` | `PLANNED`, `RUNNING`, `CONCLUDED`, `SUPERSEDED` |
| `result`, `verdict` | Required to conclude. Verdict is `SUPPORTS`, `REFUTES` or `INCONCLUSIVE` |
| `evidence` | JSON list of `{ note, url? }` (max 10), set when concluding. Links are http(s) only |
| `supersededReason`, `supersededAt`, `supersededById?` | Required reason; optional pointer to the replacing experiment |
| `createdBy` | `USER` now. `AGENT` is reserved for validation proposals (#191), always HITL |

**Lifecycle:** `PLANNED → RUNNING → CONCLUDED`; a planned experiment may conclude directly. Any non-superseded experiment can be `SUPERSEDED` with a required reason. `SUPERSEDED` is terminal. A concluded experiment is immutable except by superseding it. **There is no delete.**

**Events:** every change writes an `EmbryoEvent`: `EXPERIMENT_ADDED`, `EXPERIMENT_UPDATED` (start or conclude), `EXPERIMENT_SUPERSEDED`.

**Closed embryos** (follows ADR 0003 and 0005):

| State | Experiment reads | Experiment writes |
|---|---|---|
| Living | yes | yes |
| `FOSSIL` | yes | `409`, like every other write |
| `TRANSPLANTED` | yes | `409`: after a transplant the only write is a user note (ADR 0005). A new experiment about the outside artefact belongs in a note |

**Link to a transplant:** no foreign key. The experiments stay on the embryo and remain readable after it closes, so they are the evidence behind the transplant reason. The transplant reason may cite concluded experiments that `SUPPORTS` the idea. This ADR does **not** make them a requirement: what evidence a transplant needs is the open lifecycle question (#190). A later change may snapshot the supporting experiment ids into the `TRANSPLANTED` event payload.

**Not in scope:** the agent creating experiments, validation-plan generation (#191), assignees, due dates, templates, reminders.

## Consequences

- One Prisma migration (`Experiment`, two enums, three `EventType` values) and endpoints under `server/api/embryos/[id]/experiments`.
- The detail page gets a compact collapsed panel (list and add). The embryo store is untouched.
- Depends on lifecycle semantics (#190), still unsettled: this ADR uses ADR 0005 as written. If #190 lets experiments be recorded after a transplant, the `TRANSPLANTED` row changes.
- The agent's one-question rule (ADR 0002) is unchanged. A future experiment proposal would be an additive HITL field, not a second question.

## Sources

- [Direction](/direction), "Dropped in the 2026-11 redefinition"
- [ADR 0003](./0003-no-delete-fossils), [ADR 0005](./0005-transplanted-and-maturing)
- `prisma/schema.prisma`, `utils/embryo-experiments.ts`, `server/api/embryos/[id]/experiments/`
