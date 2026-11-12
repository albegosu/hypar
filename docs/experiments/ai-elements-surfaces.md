# Experiment: ai-elements surfaces

> **Status:** implemented (2026-08). Hypar consumes [`ai-elements-nuxt`](https://github.com/albegosu/ai-elements-nuxt) `1.5` as a headless UI layer. The agent contract stays JSON `{ question, connections, … }` — not a chatbot `UIMessage` stream.

The library was already a module in `nuxt.config.ts` with a terminal theme for `[data-ai-*]` hooks. No page used an `Ai*` component. This experiment wires primitives onto the embryo collaborator, the connection graph, the garden queue, and settings.

---

## Problem

Hypar's pitch is that surviving interaction patterns are extracted into `ai-elements-nuxt`. Until this experiment, the extraction pipeline was reversed: the library existed, the lab did not use it. The agent panel was custom HTML; SSE `chunk` events were ignored; connections were a flat list; settings was a stub.

## Thesis

Headless AI UI can serve a *collaborator* (one question, HITL links, typed graph) without turning the product into a chatbot — if we map domain objects onto primitives instead of adopting `useAiChat`.

## What we mounted

| Surface | Components | Domain mapping |
|---|---|---|
| `agent.collaborate` | `AiMessage`, `AiMarkdown`, `AiPromptInput`, `AiShimmer`, `AiStreamingCursor`, `AiErrorBoundary`, `AiConfirmation`, `AiContext`, `AiSuggestion`, `AiSpeechInput` | Turns, reply, stream preview of `question`, pending connection/path/fossil |
| Connections | ~~`AiCanvas`, `AiNode`, `AiEdge`, `AiControls`~~ → hypar SVG compass | Replaced 2026-11: the workflow canvas read as a pipeline editor. See [Connection compass](#connection-compass) |
| Garden | `AiQueue`, `AiSpeechInput` | Unanswered `PENDING_QUESTION` notes; voice seed capture |
| Settings | `AiModelSelector` | Ollama tags (cookie override, sent on the next agent POST) |

## What we did not mount

`useAiChat` / `createChatHandler`, `AiSources`, `AiPlan` / `AiTask`, visible `AiReasoning` / `AiChainOfThought`, `AiConversation` as the garden, coding-agent surfaces (`Sandbox`, `Commit`, …). Those either contradict [The Agent](/concepts/agent) or belong to later experiments. Method moves are now lightly visible on the challenge hero (from `payload.move`), without a Munari stepper.

## Observations to collect

1. Does streaming the partial `question` field feel like thinking-with, or like watching JSON form?
2. Do dashed inferred edges make agent speculation visually weaker than user-drawn links? ([open question](/open-questions))
3. Does `AiContext` (seed, tensions, turn count) answer “what does the agent know?” without dumping the whole garden?
4. Which of these survive extraction back into the library (likely: typed inferred-vs-explicit edges on a knowledge graph, not another chat demo)?

## Connection compass

The canvas (boxes, grid, zoom, drag, type as an edge label) put every neighbour on a circle where position meant nothing. The compass in `components/embryo/ConnectionGraph.vue` (layout in `utils/connection-compass.ts`) makes position carry the meaning:

- **Direction = relation type.** Extends up, reinforces right, resurrects down (from fossils), contradicts left.
- **Distance = trust.** User-drawn or confirmed links sit on the inner ring; agent hypotheses wait on the dashed outer ring with a drifting dashed edge.
- **Size = growth.** Neighbours are circles with their lifecycle glyph, larger as they mature.
- **Lens.** Chips filter by type or by agent hypotheses; the rest fades.
- Hover or focus shows the seed, relation and note; an unconfirmed outgoing hypothesis can be confirmed or dismissed in place (same path as the pending queue). Click opens the embryo.

It is plain SVG, not an `Ai*` primitive. If it holds up, the extraction candidate is a radial "typed ego graph" (sectors by edge type, rings by confidence) rather than the generic canvas.

## Non-goals

- Replacing the embryo event log with AI SDK message persistence.
- Garden-wide graph layout (force-directed). The compass is one embryo's neighbourhood.
- Server-side persistence of the selected model (cookie + request body only).
