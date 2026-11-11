# The Agent

The agent in Hypar is not an assistant. It does not wait for queries. It does not retrieve documents on demand.

It is a **collaborator with its own voice** — one that has stakes in the health of the knowledge system and participates actively in the development of ideas.

## What the agent is not

**Not a search engine.** You don't query the agent. The agent engages with your embryos — it comes to you, with context you didn't ask for, because you opened the idea (auto-engage) or you replied.

**Not a chatbot.** General conversation is not the agent's purpose. Every interaction is anchored to a specific embryo. The agent doesn't chat — it thinks alongside. The UI is `ai-elements-nuxt` primitives mapped onto embryo events, not a `useAiChat` transcript.

**Not an assistant.** An assistant executes instructions. The agent makes proposals. You can ignore them. But the agent has a perspective and shares it.

## What the agent does

### Asks questions

The agent's primary mode of engagement is the question. Not questions to gather information for itself, but questions that push an embryo forward.

The question is not generic. It follows the [lifecycle](/concepts/lifecycle) as a method:

| State | Preferred move | What the question does |
|---|---|---|
| Latent | **DEFINE** | Names the real problem. If the seed is already a solution, recovers what it is papering over. |
| Germinating | **PROBE** (or **INVERT**) | Tests assumptions. *What would have to be true for this to be wrong?* |
| Growing | **VARIETY** | Opens alternative *paths* — directions, not the first clever answer. Paths are proposals the user can keep as tensions or dismiss. |
| Maturing | **VALIDATE** | Asks for the evidence, or the cheapest experiment, that would prove the idea or kill it. |
| Fossil · Transplanted | — | No agent input. |

The spoken turn is still **exactly one question**. Paths, fossil and transplant proposals are additive fields, not a second question. The move name is logged on the `AGENT_QUESTION` event and shown lightly on the challenge hero (move + short hint) so stance is legible without becoming a method tutorial.

The turn **streams**: the client previews the forming `question` field, then persists the parsed JSON on `done`.

Good agent questions are uncomfortable. They identify the tension the embryo hasn't resolved:

- *"What problem is this checklist actually solving?"*
- *"What would have to be true for this to be wrong?"*
- *"This is the same idea as another living embryo. What's different?"*

The agent does not ask questions to be helpful. It does not teach a named method. The method is how it thinks.

### Surfaces connections

The agent may propose links of type `REINFORCES`, `CONTRADICTS`, `EXTENDS`, or `RESURRECTS` (fossils only). Those proposals create **unconfirmed** `Connection` rows (`detectedBy: AGENT`) so the graph can draw dashed inferred edges, plus a `PENDING_CONNECTION` note. You accept (confirms the row) or dismiss (deletes the unconfirmed row).

Connections are surfaced as proposals, not facts. You decide whether the connection is real.

### Suggests fossilization

On `MATURING` embryos the agent may attach a `PENDING_FOSSIL` note with one of three kinds of death:

- **Ill-defined problem** (`ILL_DEFINED`) — the idea closed because the problem was never named
- **Wrong path** (`WRONG_PATH`) — a simpler path existed
- **Superseded** (`SUPERSEDED`) — another idea replaced this one

You accept (fossilize with that reason) or dismiss. The agent does not fossilize silently.

### Suggests transplant

On `MATURING` embryos, when you say the idea already works and is in use, the agent may attach a `PENDING_TRANSPLANT` note with the reason it worked. Accepting asks you what it became (a link or a reference). It never proposes fossil and transplant in the same turn ([ADR 0005](/decisions/0005-transplanted-and-maturing)).

### Records reasoning

Every agent question, every accepted path, every dismissed note, every reply is an event or a note. Skip (dismiss without reply) does **not** write a `USER_RESPONSE` event — only the note is dismissed.

---

## The negotiation model

| Trigger | What happens |
|---|---|
| User initiates fossilization | A reason form (optional kind chips + required text). Not an agent interview. |
| Agent suggests fossilization | HITL confirm widget. Accept, or dismiss. Decision is the note + `FOSSIL_PROPOSED` / `FOSSILIZED` events. |
| User ignores agent suggestion | Dismiss the note. The agent does not auto-repeat that turn. |

A trace remains for accept and for agent proposals. Fossilization cannot happen without a recorded reason.

---

## What the agent knows

Per invocation the agent receives:

- The current embryo: seed, state, unresolved tensions, last ~12 agent/user turns
- Up to **15 other living embryos** (you can lower it to 0–15 in **Settings → agent**) and **5 fossils** owned by you
- Which of those are already outgoing connection targets (so it does not re-propose them)
- What sparked the seed, when it was planted from a [second-brain](/guide/second-brain) capture: its title and essence, as context for the seed, never as the idea
- While `GERMINATING` or `GROWING` only: the index of the user's second-brain wiki, if they connected one — topic and item names, as **contrast** and never as a recommendation ([experiment](/experiments/saved-references-as-contrast))

It does **not** have the rest of the garden beyond that cap. Connection surfacing would benefit from fossils; question-asking benefits from a narrow thread. See [Open Questions](/open-questions).

### Web research

The researcher ([ADR 0007](/decisions/0007-external-knowledge)) searches the web through the user's provider: Anthropic and OpenAI with their native search tools, Ollama Cloud with its web search API. Local Ollama cannot search.

- **When:** the **Research** button on an embryo, or automatically once per state when an embryo is in `GERMINATING` or `MATURING`, before the question, if the user turned that on in Settings.
- **What it looks for:** it leans by state. `GERMINATING` refutes (prior art, counter-evidence), `GROWING` extends (adjacent work, analogies), `MATURING` does both to validate.
- **What it leaves:** up to 4 findings, each stored as an open agent tension with its claim, its stance (refute or extend) and its source. A finding whose URL was not in the search results is dropped. The collaborator then reads those tensions like any other.
- **Privacy:** the idea's text goes to the provider's search. Settings has the switch to turn research off.

The provider and model are chosen in **Settings** ([ADR 0008](/decisions/0008-bring-your-own-provider)).

---

## The agent's tone

The agent is direct. It does not hedge unnecessarily. It does not apologize for surfacing a contradiction.

But the agent is not aggressive. It makes proposals, not pronouncements. It presents its reasoning, not conclusions. The user's mind is the system being augmented — the agent never overrides it.

---

*Next: [Fossils & Memory](/concepts/fossils)*
