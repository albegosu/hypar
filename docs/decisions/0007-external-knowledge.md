---
status: accepted
date: 2026-11-05
---

# ADR 0007: External knowledge (web research)

- **Status:** accepted
- **Date:** 2026-11-05

## Context

Until now the agent had **no external knowledge**: only the current embryo, up to 15 living peers and 5 fossils, plus the second-brain index as contrast. That was an explicit non-goal in [method as process](/experiments/method-as-process). The 2026-11 redefinition asks hypar to *research and validate* ideas, which needs the world: prior art, counter-evidence, users and markets.

Evidence warns that research agents drift toward *local elaboration* (ideas cluster near existing work), and that LLMs homogenize ideas.

## Decision

- The agent (as the researcher role, [ADR 0006](./0006-agent-roles-one-voice)) **searches the web**, both to **refute** (prior art, counter-evidence, reasons it fails) and to **extend** (evidence, adjacent work, analogies).
- **Every web claim carries its source.** Unsourced claims are marked as the agent's opinion.
- Research results enter as HITL material (notes, tensions), never as an unconfirmed fact on the embryo.
- The user's own material (seeds, second-brain, fossils) stays a first-class source of variety, next to the web.

## Implementation (2026-11)

- `POST /api/embryos/:id/research` runs the researcher; `server/utils/embryo-research.ts`. Anthropic and OpenAI use their native web search tools, Ollama Cloud a search tool over its web search API. Local Ollama has no search and the UI says so.
- Each finding becomes an **open agent tension** with `claim`, `stance` (`REFUTE` / `EXTEND`), `sourceUrl` and `sourceTitle`. A tension is a question the user resolves, so the finding never becomes a fact on the embryo. Findings whose URL was not returned by the search are dropped rather than marked as opinion.
- Triggers: a **Research** button per embryo, and an opt-in auto mode that runs once per state in `GERMINATING` and `MATURING` before the collaborator's question.
- Privacy: research is on by default with a visible notice, and `UserSettings.webResearch` turns it off per user.
- First guess at the balance (`utils/research.ts`): `GERMINATING` refutes, `GROWING` extends, `MATURING` does both.

## Consequences

- Drops the non-goal "the agent has no external knowledge".
- Needs a search capability: provider-native web search tools, or a separate search API. Availability then depends on the user's provider ([ADR 0008](./0008-bring-your-own-provider)).
- Privacy: an idea's content leaves the user's machine to search engines. This must be visible and controllable per embryo or per user.
- Still open: the refute/extend balance per state, and whether research narrows idea diversity (measure path diversity with and without it).

## Sources

- [Direction](/direction)
- [Ideas lab landscape](/experiments/ideas-lab-landscape) — §2.2, §2.3, §6
- [Saved references as contrast](/experiments/saved-references-as-contrast)
