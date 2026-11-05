---
status: accepted
date: 2026-11-05
---

# ADR 0005: TRANSPLANTED end state and MATURING

- **Status:** accepted
- **Date:** 2026-11-05
- **Extends:** [ADR 0003 — No-delete fossils](./0003-no-delete-fossils)

## Context

The lifecycle is `LATENT → GERMINATING → GROWING → MATURE → FOSSIL`. An embryo can stay alive or die. There is no way to close an idea *because it worked*. An idea that became a component, a doc, a repo or a skill either stays `MATURE` forever or is fossilized as if it had failed.

The [2026-11 redefinition](/direction) makes hypar a creative harness that guides ideas toward being discarded or watered. That needs two exits, not one, and a state that means *being validated*, not *done*.

## Decision

- Rename `MATURE` → **`MATURING`**: the embryo is undergoing the processes (research, experiments, artefacts) that decide whether it is valid or discardable.
- Add a terminal state **`TRANSPLANTED`**: the idea has sprouted and now lives outside the garden (productised or in use).
- A transplant keeps an **outcome link** (what it became) and a **required reason** (what made it work), the success counterpart to the fossil reason. Nothing is deleted.

Rules:

| Question | Decision |
|---|---|
| Which state can be transplanted? | Only `MATURING`, so the idea passes through validation first |
| Who sets it? | The agent may **propose** it (HITL, like fossil proposals); only the user confirms |
| Is it immutable? | Closed to the agent (`409` on agent turns). The user can still add notes as the outside artefact evolves. The seed and reason stay immutable |
| What is stored? | Outcome URL or reference, a free-text reason, a timestamp. The artefact itself is not stored |

## Consequences

- A Prisma enum migration (`MATURE` → `MATURING`, plus `TRANSPLANTED`). About 19 non-doc files reference `MATURE` (stance, copy, garden, tests, evals).
- Method stance for `MATURING` moves from *select the simplest* to *validate*: evidence, the cheapest killing experiment, readiness to transplant or fossilize.
- The garden needs a place for transplanted ideas, next to strata. This is a new open question about navigation.
- `docs/concepts/lifecycle.md`, the agent docs and AGENTS.md need updating when this is built.
- Out of scope: tracking the artefact's life after transplant.

## Sources

- [Direction](/direction) — the embryo, still to define
- [Ideas lab landscape](/experiments/ideas-lab-landscape) — §5 and §6
- [ADR 0003](./0003-no-delete-fossils)
- `prisma/schema.prisma` (`EmbryoState`), `utils/embryo-method.ts`
