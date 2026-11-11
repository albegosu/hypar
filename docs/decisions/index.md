# Decisions (ADRs)

Architecture Decision Records for hypar. Short, durable records of **settled** choices — not experiment prose and not scratch plans.

Scratch explorations live in [`agents-plans/`](https://github.com/albegosu/hypar/blob/main/agents-plans/) and are **not** source of truth. Research write-ups live under [Experiments](/experiments/). Product north star: [Direction](/direction).

## Status vocabulary

| Status | Meaning |
|---|---|
| **proposed** | Under discussion; not yet binding |
| **accepted** | Current decision — follow unless superseded |
| **superseded** | Replaced by a newer ADR (link it) |
| **deprecated** | No longer advised; kept for history |
| **historical** | Pre-dates the current ADR set or records intent that later evolved; useful context, not a map of today's tree |

## Naming

```
NNNN-short-title.md
```

- `NNNN` — zero-padded sequence (`0001`, `0002`, …)
- `short-title` — kebab-case

Optional YAML frontmatter:

```yaml
---
status: accepted
date: 2026-08-01
---
```

## Template

Copy [`_template.md`](./_template.md) when proposing a new ADR.

## Index

| ADR | Status | Summary |
|---|---|---|
| [0001 — Single Nuxt app](./0001-single-nuxt-app) | accepted | One Nuxt 3 process; no separate API repo / CORS split |
| [0002 — Agent one-question constraint](./0002-agent-one-question) | accepted | Exactly one challenging question per agent turn |
| [0003 — No-delete fossils](./0003-no-delete-fossils) | accepted | No delete; close with required reason as fossil |
| [0004 — Glass visual language](./0004-glass-visual-language) | accepted | Glass + rounded light/dark app UI; not terminal chrome |
| [0005 — TRANSPLANTED and MATURING](./0005-transplanted-and-maturing) | accepted | Success end state next to fossil; `MATURE` becomes `MATURING` |
| [0006 — Agent roles, one voice](./0006-agent-roles-one-voice) | accepted | Collaborator, researcher, critic inside; one question outside |
| [0007 — External knowledge](./0007-external-knowledge) | accepted | Web research to refute and extend; every claim sourced |
| [0008 — Bring your own provider](./0008-bring-your-own-provider) | accepted | Per-user Anthropic, OpenAI, Ollama; encrypted keys |
| [0011 — Critic role](./0011-critic-role) | proposed | Separate critic call: typed gate suggestions with confidence, as HITL proposals |
| [monorepo-unification](./monorepo-unification) | historical | Pre-ADR plan to collapse multi-app RAG monorepo into one Nuxt app |

---

*Agents: start at [AGENTS.md](https://github.com/albegosu/hypar/blob/main/AGENTS.md). Do not invent decisions — cite existing docs or open an ADR as **proposed**.*
