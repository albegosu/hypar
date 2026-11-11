---
status: proposed
date: 2026-11-11
---

# ADR 0011: Critic role

- **Status:** proposed
- **Date:** 2026-11-11
- **Extends:** [ADR 0006 — Agent roles, one voice](./0006-agent-roles-one-voice)
- **Depends on:** lifecycle semantics (issue #190), not settled. This ADR uses the states of [ADR 0005](./0005-transplanted-and-maturing) as they are; if #190 changes what `GROWING → MATURING` means, the `MATURE` suggestion changes with it.

## Context

ADR 0006 names three roles: collaborator, researcher, critic. The researcher exists ([ADR 0007](./0007-external-knowledge)). The critic does not: gate decisions (is this ready to mature, which fossil kind, which path wins) still come from the collaborator, in the same prompt that generates the question. LLM judges favour their own output and are poorly calibrated, so the generator should not grade itself. Issue #193 asks for the critic as a separate call that returns typed suggestions with a confidence.

## Decision

A **Critic** is a separate model call that reads the embryo and returns typed gate suggestions. It is not a second voice (ADR 0002, ADR 0006): it never speaks in the transcript, never asks a question and never changes state. Every suggestion arrives as a HITL proposal and the human decides every transition.

### Suggestion schema

Validated with zod (`utils/critic.ts`). Each suggestion has a `kind`, a `confidence` in `[0, 1]` and a one-sentence `reason`:

| `kind` | Extra field | Valid in | Means |
|---|---|---|---|
| `MATURE` | none | `GROWING` | Ready to move to `MATURING` |
| `FOSSIL` | `fossilKind`: `ILL_DEFINED` \| `WRONG_PATH` \| `SUPERSEDED` | `GERMINATING`, `GROWING`, `MATURING` | Should close as a fossil, of this kind |
| `PATH_WINNER` | `pathIndex` (into the paths shown to the critic) | `GROWING` | This path survives the tensions best |

Transplant stays with the collaborator for now: it depends on the user saying the idea works and is in use, which is not something a critic can judge from the dialogue.

### Confidence handling

- Confidence is the critic's own estimate. It is shown as a band (`high` ≥ 0.8, `medium` ≥ 0.6, otherwise `low`) and kept as a number in the event.
- Suggestions below `0.4` are dropped, not shown as "low". The floor is a first guess.
- At most one suggestion per kind. `MATURE` and `FOSSIL` are mutually exclusive: the more confident one is kept.
- Items that fail the schema are dropped one by one. An unparseable answer yields no suggestions, never an error shown as advice.
- Confidence is uncalibrated until measured against `evals/embryo-stance.jsonl`. The UI must not present it as a probability.

### Mapping to existing proposals

No new note type and no migration:

| Suggestion | Stored as |
|---|---|
| `FOSSIL` | `AgentNote` `PENDING_FOSSIL`, same `KIND: reason` content as the collaborator's proposal, so accept and dismiss already work. At most one pending fossil at a time |
| `MATURE` | `AgentNote` `OBSERVATION`, content `CRITIC_MATURE (0.85): reason` |
| `PATH_WINNER` | `AgentNote` `OBSERVATION`, content `CRITIC_PATH_WINNER (0.70) [index] path: reason` |

Every suggestion also writes an `AGENT_SUGGESTION` event with `kind: 'critic'`, the confidence, band, provider and model. A new run dismisses the previous run's open `MATURE` and `PATH_WINNER` observations.

`OBSERVATION` is a stopgap: the UI does not render these notes and there is no accept action for them yet. A dedicated `PENDING_MATURE` / `PENDING_PATH_WINNER` note type, plus accept actions, is the follow-up and would need a migration (the folder for this issue's migration is reserved as `20261112040000_`).

### When it runs

**On demand only**: `POST /api/embryos/:id/critic`. No auto-run and no setting by default. It returns `409` for fossils, transplanted embryos and `LATENT` embryos (nothing to judge). It is separate from the agent endpoint, so a collaborator turn stays one question and costs the same.

Whether it should run lazily at gates (for example when an embryo has been in `GROWING` for N turns) is open.

### Why a separate model

The critic must not be the generator, and preferably comes from another model family (ADR 0006), to reduce self-preference. The server util (`server/utils/embryo-critic.ts`) takes the model as a parameter and defaults to the user's current model. Until per-role model selection exists (issue #194), the default means the critic and the collaborator share a model, which gives separation of prompt and call but not of model. That is weaker than the decision above and the UI should say so once it exists.

### Cost

One extra non-streaming call per run, with a short output (at most a few suggestions) and a prompt of the seed, up to 8 dialogue turns, open tensions and the paths. No web search. Because it is on demand, cost is bounded by how often the user asks. A cheaper model is a good fit for the critic, which is another reason to wait for per-role models.

## Consequences

- Gate judgement moves out of the collaborator prompt over time. The collaborator's own `fossil` / `transplant` fields stay until the critic proves itself on the evals.
- The critic needs an eval of its own: suggestions against labelled embryo histories, and calibration of confidence.
- Out of scope: auto-advancing state, showing the critic as a voice, and a calibrated decision model such as Jev (a candidate, pending evaluation).

## Open questions

- Is a shared model acceptable as the default, or should the critic refuse to run until a different one is chosen?
- Is the `0.4` floor and the band edges right, and should they depend on the kind (a wrong `FOSSIL` costs more than a wrong `MATURE`)?
- Should the critic see researched tensions and their sources, or only the dialogue?
- Does a visible confidence nudge the user to accept? Hiding the number and showing only the band is an alternative.
- Should `MATURE` and `PATH_WINNER` get real note types and accept actions, or should they fold into tensions?
- Lazy auto-run at gates, or on demand only.
- Whether `MATURE` survives the lifecycle review in issue #190.

## Sources

- [ADR 0006](./0006-agent-roles-one-voice), [ADR 0002](./0002-agent-one-question), [ADR 0005](./0005-transplanted-and-maturing)
- [Direction](/direction) — The agent
- `utils/critic.ts`, `server/utils/embryo-critic.ts`, `server/api/embryos/[id]/critic.post.ts`
