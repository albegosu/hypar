---
status: accepted
date: 2026-11-05
---

# ADR 0008: Bring your own provider

- **Status:** accepted (direction). Implementation details are proposed.
- **Date:** 2026-11-05

## Context

hypar is now a product for people with ideas, not only for the maintainer ([Direction](/direction)). Today one provider is configured server-wide (`server/utils/ollama.ts`: Ollama local or Ollama Cloud through an OpenAI-compatible client). Users have their own subscriptions and preferences. Web research and the critic role also depend on provider capabilities.

## Decision

Each user connects **their own LLM provider**. The minimum set:

- **Anthropic** (Claude)
- **OpenAI**
- **Ollama**, local or cloud

Proposed implementation:

- Use the Vercel AI SDK provider packages, which are already in the stack, behind one `getModel(user, role)` resolver.
- Store API keys per user, **encrypted at rest**, never logged, and never returned to the client after saving (same spirit as `IntegrationToken`).
- Model choice per role (collaborator, researcher, critic), with sensible defaults per provider ([ADR 0006](./0006-agent-roles-one-voice)).
- A server-wide fallback provider for local development.

## Consequences

- Settings gain a provider section. Auth and data must stay strictly per user.
- Features vary by provider (native web search, structured output). The UI must degrade honestly when a capability is missing.
- Prompts and evals must run on more than one model family. `evals/embryo-stance.jsonl` becomes a cross-provider check.
- Cursor was considered: it is an editor, not a public model API. It fits as a destination for transplanted artefacts, not as a provider.

## Sources

- [Direction](/direction) — The agent
- `server/utils/ollama.ts`
- [Ideas lab landscape](/experiments/ideas-lab-landscape) — §6
