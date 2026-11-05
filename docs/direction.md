# Direction

Lab and product north star for hypar. One page. Grounded in [README](https://github.com/albegosu/hypar/blob/main/README.md), [history](/history), [open questions](/open-questions) and the [ideas lab research](/experiments/ideas-lab-landscape) — not a speculative roadmap.

> **2026-11 redefinition.** hypar moves from "a lab for how humans and agents think together" to **a creative harness: an ideas lab that validates**. Items marked *(direction, not runtime)* are decided intent, not yet built. ADRs pending.

## Why hypar exists

Hypar started as a RAG reference implementation. Shipping that stack surfaced a deeper question: not *how* to build AI knowledge tools, but *what they should feel like to use*. Chat-over-retrieval felt like the wrong abstraction — a search engine dressed as conversation.

The pivot (August 2026): explore a knowledge system where the agent is a **collaborator in the thinking process**, not a document retriever. The RAG work was archived, not deleted — see [History](/history).

The redefinition (November 2026): the collaborator is not enough on its own. Ideas need to be **researched and validated**, not only challenged.

## What hypar is

**A creative harness.** Its core is building the **formal and informal context in which ideas mature**. *Formal* means method, lifecycle, validation, evidence. *Informal* means intuition, references, images, conversation, half-formed thoughts. Within that context, any concept or idea is guided toward being **discarded** (fossil) or **watered** until it lives in the world (transplanted).

No success metric is set on purpose. Measuring the harness is not relevant yet. The goal is that the context exists and is rich.

- **For people with ideas, not only for the maintainer.** It is a product for others. Extracting UI patterns to [`ai-elements-nuxt`](https://github.com/albegosu/ai-elements-nuxt) is one by-product, not the purpose.
- **Any idea, loosely bounded.** Product, technical, research, personal. The edges stay open on purpose. The few non-goals below are what keeps it from becoming a generic chatbot.
- **Validation depends on context.** The idea, the proposed solution and the end user decide how it is validated. The process may be thinking and research inside hypar, experiments recorded in hypar, or artefacts hypar helps produce, whichever the context asks for. *(direction, not runtime)*

## The embryo

- **Capture → seed.** Input can be anything: a sentence, an image with text, a link with "pull the root idea out of this article". *(direction, not runtime — today the seed is one typed sentence)*
- **Lifecycle** — `LATENT → GERMINATING → GROWING → MATURING`, ending in **`FOSSIL`** (discarded, reason required) or **`TRANSPLANTED`** (it worked and lives outside the garden, reason and outcome required). See [ADR 0005](/decisions/0005-transplanted-and-maturing).
- **No delete** — closed ideas persist, whether they died or were transplanted, with their reason.
- **Validation plan** — the agent infers how *this* idea should be validated. The plan is both implicit in its questions and visible and editable by the user. *(direction, not runtime)*
- **Tensions, paths, connections** — open questions, alternative directions, typed links.

## The agent

**Roles inside, one voice outside.** *(direction, not runtime)*

- **Collaborator** — the only voice. One challenging question per turn ([ADR 0002](/decisions/0002-agent-one-question)).
- **Researcher** — searches the web to refute (prior art, counter-evidence) and to extend (evidence, adjacent work). Its output arrives as sourced tensions, never as a second voice. *(runtime: Research button and optional auto-research, [ADR 0007](/decisions/0007-external-knowledge))*
- **Critic** — typed gate suggestions with confidence (ready to mature, fossil kind, which path wins). It is separate from the generator and preferably from another model family. A calibrated decision model such as Jev is a candidate.
- **Bring your own provider** — each user connects their own LLM provider: at least Anthropic, OpenAI and Ollama Cloud, with a server-wide Ollama as the fallback ([ADR 0008](/decisions/0008-bring-your-own-provider)). *(runtime for the collaborator; researcher and critic models come with those roles)*

## What we are optimizing for

- A **harness**, not a chat: the process guides; the human decides every transition
- Productive **tension** between human and agent (challenge over comfort — sycophancy measurably hurts thinking)
- **Fast, cheap death** of weak ideas, and accountable reasons both when ideas die and when they are transplanted
- **Evidence over opinion** — research claims carry their source
- Variety drawn from the **user's own** material (seeds, saved references, fossils), not only from the model's average
- Claims that match **runtime** — aspirational ideas stay marked as such
- A **glass + rounded** app visual language (light and dark) — see [ADR 0004](/decisions/0004-glass-visual-language)

## What we are not optimizing for

- A general-purpose chatbot or transcript UI
- Autonomous agents that run ideas without the human
- Several agent voices talking to the user
- A methods UI (named techniques, steppers, wizards) — methods are invisible agent moves
- Multi-user shared gardens (deferred — single garden per user; see [Open Questions](/open-questions))
- Treating [agents-plans/](https://github.com/albegosu/hypar/blob/main/agents-plans/) scratch notes as product truth

Dropped in the 2026-11 redefinition: *"the agent has no external knowledge"* (it now researches the web) and *"not a tracker of experiments"* (validation may record experiments when the context asks for it).

## Still to define

- **Lifecycle semantics.** What separates `GROWING` from `MATURING`, and what evidence a transplant requires.
- **Capture → seed.** Whether the root idea extracted from a capture becomes the immutable seed after the user confirms it.

## Experiments ↔ product ↔ extraction

```
experiment in hypar  →  observe  →  document in docs/experiments/
                                 →  settle durable choices in docs/decisions/
                                 →  extract surviving UI patterns to ai-elements-nuxt
```

## Pointers

| Need | Where |
|---|---|
| Agent first-read | [AGENTS.md](https://github.com/albegosu/hypar/blob/main/AGENTS.md) |
| Ideas lab research | [Ideas lab landscape](/experiments/ideas-lab-landscape) |
| Active tensions | [Open Questions](/open-questions) |
| Experiment log | [Experiments](/experiments/) |
| Settled choices | [Decisions](/decisions/) |
| How it is built | [Architecture](/architecture/) |
| Pivot story | [History](/history) |
