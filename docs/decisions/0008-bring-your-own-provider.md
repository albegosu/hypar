---
status: accepted
date: 2026-11-05
---

# ADR 0008: Bring your own provider

- **Status:** accepted. Implemented for the collaborator role (see Implementation).
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

## Implementation (2026-11)

- `ProviderConnection` holds one provider per user: `ANTHROPIC`, `OPENAI` or `OLLAMA_CLOUD`. Local Ollama stays the server fallback only, so the server never fetches a URL a user typed.
- The key is checked against the provider's model list before saving, sealed with AES-256-GCM (`server/utils/secret-box.ts`, `PROVIDER_KEYS_SECRET` or the auth secret), and only its last four characters are shown back.
- `resolveChatModel(userId)` (`server/utils/llm-provider.ts`) picks the user's provider or the fallback. Only the collaborator role exists today, so the connection stores one `collaboratorModel`. Researcher and critic models come with those roles.
- Settings → model provider: connect, change key, disconnect, choose the model from the provider's own list.

## Consequences

- Settings gain a provider section. Auth and data must stay strictly per user.
- Features vary by provider (native web search, structured output). The UI must degrade honestly when a capability is missing.
- Prompts and evals must run on more than one model family. `evals/embryo-stance.jsonl` becomes a cross-provider check.
- Cursor was considered: it is an editor, not a public model API. It fits as a destination for transplanted artefacts, not as a provider.

## Sources

- [Direction](/direction) — The agent
- `server/utils/ollama.ts`
- [Ideas lab landscape](/experiments/ideas-lab-landscape) — §6
