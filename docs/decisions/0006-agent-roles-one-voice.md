---
status: accepted
date: 2026-11-05
---

# ADR 0006: Agent roles inside, one voice outside

- **Status:** accepted
- **Date:** 2026-11-05
- **Extends:** [ADR 0002 — Agent one-question constraint](./0002-agent-one-question)

## Context

The agent is gaining jobs: asking the challenging question, researching the web ([ADR 0007](./0007-external-knowledge)), and judging gates (maturity, fossil kind, which path wins). Doing all of this in one prompt mixes generation with judgement. LLM judges show self-preference and miscalibrated confidence. Exposing each job as a separate voice would turn hypar into a committee chat, which is what ADR 0002 rejects.

## Decision

Three roles under the hood, one voice to the user:

| Role | Does | Reaches the user as |
|---|---|---|
| **Collaborator** | Asks the single challenging question (ADR 0002) | The spoken turn, the only voice |
| **Researcher** | Searches to refute and to extend; every claim is sourced | HITL notes or tensions with sources |
| **Critic** | Typed gate decisions with confidence | HITL suggestions (transition, fossil kind, path winner). The user decides |

Impartiality comes from **separating roles**: the critic is not the generator, and preferably comes from a different model family. A calibrated decision model (for example TypeSafe's Jev) is a candidate critic, pending evaluation against `evals/embryo-stance.jsonl`.

## Consequences

- The agent pipeline becomes orchestration: research and critique feed the collaborator's context and HITL fields.
- Cost and latency rise per turn. Roles may run lazily (research only in some states, critic only at gates).
- Each role can use a different provider or model, which needs per-role model settings ([ADR 0008](./0008-bring-your-own-provider)).
- Out of scope: several agents talking in the UI, or autonomous runs without the human.

## Sources

- [Direction](/direction) — The agent
- [Ideas lab landscape](/experiments/ideas-lab-landscape) — §2.4 (judge bias), §4 (Jev)
- [ADR 0002](./0002-agent-one-question)
