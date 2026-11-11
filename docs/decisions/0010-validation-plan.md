---
status: proposed
date: 2026-11-12
---

# ADR 0010: Validation plan

- **Status:** proposed (the maintainer decides; nothing here is binding yet)
- **Date:** 2026-11-12
- **Extends:** [ADR 0002](./0002-agent-one-question), [ADR 0006](./0006-agent-roles-one-voice)
- **Depends on:** [ADR 0005](./0005-transplanted-and-maturing) as written today, and on the lifecycle semantics ADR (#190, still being drafted). If #190 changes what separates `GROWING` from `MATURING`, the states in which the plan is proposed and shown change with it.
- **Issue:** #191

## Context

The [direction](/direction) says validation depends on context: the idea, the proposed solution and the end user decide how it is validated. Today the `MATURING` stance only asks, one turn at a time, for the evidence or the cheapest killing experiment. The user never sees the shape of what the agent is steering toward, and cannot correct it.

## Decision (proposed)

Each embryo may carry a **validation plan**: a short plain-text statement of how *this* idea should be validated. It is implicit in the agent's questions and also visible and editable by the user.

### Data model

| Where | What |
|---|---|
| `Embryo.validationPlan String?` | The plan in force, the user's. Plain text, max 2000 characters. `null` until accepted or written |
| `AgentNote` type `PENDING_VALIDATION_PLAN` | The agent's proposal, pending. At most one non-dismissed at a time |
| `EmbryoEvent` type `AGENT_SUGGESTION` with `kind: "validation_plan"` | Proposal log, like paths and connections |
| `EmbryoEvent` type `VALIDATION_PLAN_SET` | A user save: `plan`, `previous`, `fromProposal`, `edited`. History of the plan lives here |

Plain text rather than structured fields on purpose: the form of validation (interviews, a fake door, a spike, desk research, an artefact) varies too much by idea to fix a schema now.

### How the agent proposes and updates it

- A new optional field `validationPlan` in the agent JSON, beside `paths`, `fossil` and `transplant`. It is an **additive HITL field**, never a second question and never spoken in `question`. ADR 0002 and ADR 0006 are untouched: one question, one voice.
- Proposed only in `GROWING` and `MATURING` (enough idea and solution to validate), and only when there is no plan or the exchange showed the plan is wrong. Empty and unchanged proposals are dropped; a new one is skipped while one is pending.
- The accepted plan is shown to the agent in its next prompt so its questions stay coherent with it. The agent never writes the plan directly: it only proposes.
- Which role produces it (collaborator today, critic later per ADR 0006) is open.

### How the user edits it

- The embryo detail shows a **Validation plan** card: always while `MATURING`, earlier only if a plan or a pending proposal exists.
- A pending proposal can be **accepted**, **edited then accepted**, or **dismissed**. The user can also write or edit a plan at any time in a living state (`set_validation_plan`).
- `FOSSIL`: edits rejected with `409` (as every PATCH). `TRANSPLANTED`: edits rejected with `409`; only user notes are accepted (ADR 0005, AGENTS.md), so the plan is frozen with the embryo and stays readable.
- No delete. The plan can be replaced, and each save keeps its previous value in the event log.

### Out of scope

- Tracking whether the plan was carried out, experiment results, or gating transitions on the plan. The plan does not block `MATURING`, fossil or transplant.
- Structured steps, checklists or a methods UI (direction: methods are invisible agent moves).

## Consequences

- One Prisma migration: a nullable column and two enum values. No backfill.
- The agent prompt grows by one field and, when a plan exists, one prompt section.
- Observations can later measure how often proposals are accepted, edited or dismissed, as for connections.

## Open questions

1. Is plain text enough, or does the plan need a minimal structure (hypothesis, cheapest test, kill criterion)?
2. Which states propose it? Starting at `GROWING` assumes #190 keeps that meaning.
3. Should the user be able to clear a plan, or only replace it?
4. Should an accepted plan relax or sharpen the `MATURING` stance (for example, the transplant proposal citing the plan's criterion)?
5. Should a transplant or fossil reason have to reference the plan?
6. Which role writes it once the critic exists (ADR 0006)?
7. On resurrect, does the plan carry over to the new embryo?

## Sources

- [Direction](/direction), "Validation plan"
- [ADR 0002](./0002-agent-one-question), [ADR 0005](./0005-transplanted-and-maturing), [ADR 0006](./0006-agent-roles-one-voice)
- `utils/validation-plan.ts`, `server/api/embryos/[id].patch.ts`, `components/embryo/ValidationPlan.vue`
