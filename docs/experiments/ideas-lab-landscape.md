# Research: hypar as an ideas lab

> **Status:** research (2026-11). Nothing here is implemented. It maps what exists, what the evidence says, and which questions must stay open while the product is defined. The product intent this research led to now lives in [Direction](/direction). Settled choices still go to [Decisions](/decisions/).

The proposed direction: hypar becomes a **lab for ideas**. The human plants embryos; an LLM helps *research and validate* them, using classic creative / continuous-improvement methods and newer human–model processes, so ideas reach a useful outcome faster.

This changes one explicit non-goal today: the agent has **no external knowledge** ([method as process](./method-as-process), [The Agent](/concepts/agent)). Opening it to the web is the biggest decision below.

---

## 1. Landscape — what is similar

| Family | Examples | What they do | Gap hypar could own |
|---|---|---|---|
| **Idea-validation SaaS** | ValidatorAI, IdeaProof, Preuve and "AI co-founder" platforms | Score a startup idea: market, competitors, a report | One-shot reports, mostly vendor-graded. No life cycle, no memory of dead ideas, product ideas only |
| **AI scientists** | Google [Co-Scientist](https://arxiv.org/pdf/2502.18864) (generate → reflect → **Elo tournament via debate** → evolve → meta-review), [Kosmos](https://dev.aiwire.net/2025/11/07/futurehouse-spins-out-edison-scientific-launches-kosmos-ai-for-research/) (shared world model, every claim linked to code and citations) | Autonomous hypothesis generation and validation | Autonomous, domain-specific (biology). The human is a reviewer, not a co-thinker |
| **Tools for thought + AI** | Heptabase (canvas, AI explains and researches), Tana (AI chains actions), NotebookLM | Store and connect knowledge, AI per item | Storage first: AI summarises and organises, it does not challenge. No notion of an idea maturing or dying |
| **Provocation research** | Sarkar, [*AI Should Challenge, Not Obey*](https://arxiv.org/html/2411.02263v2) (CACM 2024); Microsoft "lenses + provocations" | AI as provocateur: short critiques, alternatives, risks | Research prototypes, not a product. Closest to hypar's thesis |

**Read:** nobody combines *lifecycle + challenge + memory of failure + validation against the world*. Validators are external and one-shot; AI scientists are autonomous; PKM tools are complacent. hypar's spot is **a human-led lab where the agent challenges and searches for evidence, and the idea's history (including fossils) is the asset**.

---

## 2. What the evidence says (and why it matters to hypar)

1. **Sycophancy hurts thinking; friction helps.** Sycophantic replies raise confidence and lower open-minded thinking; neutral replies feel uncomfortable but support flexibility ([ACL 2026](https://aclanthology.org/2026.acl-long.2046.pdf)). Sycophantic models mislead novices ([Invisible Saboteurs](https://arxiv.org/pdf/2510.03667)). Literacy interventions alone do not fix it, so it has to be designed into the system ([AIED 2026](https://arxiv.org/html/2605.18372)). → Validates [ADR 0002](/decisions/0002-agent-one-question): one challenging question is a product feature, not a style.
2. **LLMs homogenise ideas.** Individuals get better ideas, but across people ideas converge ([Anderson et al. 2024](https://alphaxiv.org/overview/2402.01536v2), [Moon et al.](https://scale.stanford.edu/ai/repository/homogenizing-effect-large-language-models-llms-creative-diversity-empirical)). Mechanisms: the model fixates on early outputs, and all users share one distribution ([Deng, Brucks & Toubia](https://business.columbia.edu/faculty/research/examining-and-addressing-barriers-diversity-llm-generated-ideas)). Better prompts do not escape the shared space ([IDEAFix](https://arxiv.org/html/2606.00875)). → The `VARIETY` stance is necessary but not sufficient. The diversity source must be **the user** (their seeds, second-brain, fossils), not the model.
3. **Research agents narrow exploration.** 219k AI ideas were more concentrated, closer to the starting literature and lower-impact than human follow-on work ([arXiv 2605.27905](https://arxiv.org/abs/2605.27905)). → If hypar adds web research, the agent will tend toward *local elaboration*. Research should feed **contrast and refutation**, not "here's what exists, build on it".
4. **LLM judges are biased and overconfident.** Self-preference is measurable, verbalised confidence is miscalibrated ([DINCO](https://www.alphaxiv.org/@victor-wang)), and a self-review pass helps ([EMNLP 2026](https://aclanthology.org/2026.findings-emnlp.2098.pdf)). Standard advice: a judge **from a different model family**, audited against human labels. → Relevant to the Jev question below.

---

## 3. Methods — the repertoire

hypar already treats methods as **invisible agent moves**, not a UI stepper (`DEFINE · PROBE · INVERT · VARIETY · SIMPLEST`). The proposal is to expand the repertoire, not add a wizard.

### Classic (well proven, cheap to encode as moves)

| Method | Where in lifecycle | Possible move |
|---|---|---|
| 5 Whys, problem reframing (Munari) | LATENT | `DEFINE` (exists) |
| Pre-mortem ("it failed in a year; why?") | GERMINATING | `INVERT` (extend) |
| Assumption mapping / "what must be true" (Lafley/Martin) | GERMINATING | `PROBE` → assumptions as tensions |
| Toulmin argument (claim, warrant, rebuttal) | GERMINATING → GROWING | `WARRANT`: "what links your evidence to your claim?" |
| SCAMPER, analogies, TRIZ contradictions | GROWING | `VARIETY` variants |
| Six Thinking Hats / red team | GROWING → MATURE | rotate the critic's perspective |
| PDCA / Lean build-measure-learn, falsifiability (Popper) | MATURE | `TEST`: "the cheapest experiment that could kill it" |
| Retrospective / post-mortem | FOSSIL | the fossil reason (exists) |

### New human–model processes (riskier, more distinctive)

- **Provocations, not answers** (Sarkar): short critiques attached to the idea, not a chat. Fits HITL notes.
- **Debate tournament** (Co-Scientist): paths compete in pairwise debates; the human is the referee. Fits `GROWING` with `paths[]`.
- **Evidence-linked claims** (Kosmos): every agent claim from the web carries a source; unsupported claims are marked as such. Fits "claims match runtime".
- **Refutation search**: the agent searches the web *for reasons the idea is wrong or already done* (prior art, counter-evidence), not for support. Directly counters findings 2.3 and 2.4.
- **Personal diversity**: draw variety from *your* corpus (second-brain, other embryos, fossils) instead of the model's average. This is the existing [saved references as contrast](./saved-references-as-contrast) experiment, which the evidence supports.
- **Calibrated gates**: a separate, fast critic gives typed verdicts with confidence (ready to mature? prior art exists? kind of death?), and the human decides. See Jev.

---

## 4. Jev (TypeSafe AI) — does it fit?

Source: [TypeSafe AI, *Introducing System One models and Jev*](https://typesafe.ai/blog/introducing-system-one-models-and-jev) (2026, early access).

**What it is:** a "System One" model. It takes unstructured state and returns **typed decisions with calibrated probabilities**, not free text. It is trained with *RL for Calibrated Decisions*. It answers in roughly 70–500 ms, with input at about $0.04 per million tokens and free output (vendor figures, possibly subsidised), and up to 255 options per decision.

**What it is not:** it does not generate text, so it cannot ask hypar's question. The blog makes no claims about impartiality or criticism. Its "calibration" claim is self-evaluated, with no public standard benchmarks. Early access only, closed weights.

**Where it fits:** not as the collaborator, but as a **fast, calibrated classifier/judge** beside it:

| Use | Typed output | Value |
|---|---|---|
| Stance selector | `DEFINE / PROBE / INVERT / VARIETY / SIMPLEST` + p | Picks the move *before* the LLM writes; tests "stance is theatre" |
| Solution-shaped seed detector | `bool` + p | The heuristic [method as process](./method-as-process) Q3 left open |
| Maturity / fossil gate | `ready / not ready`, `ILL_DEFINED / WRONG_PATH / SUPERSEDED` + p | Suggests transitions with confidence; the human still decides |
| Connection typing | relation enum + p | Cheap triage before the LLM proposes a link |
| Path tournament judge | `A / B` + p | Cheap pairwise judge from another family (less self-preference) |

**Verdict:** worth a **bounded experiment** as the *System 1* (gates, routing, judging) beside the LLM *System 2* (question, research). Its calibration must be checked against your own labels (`evals/embryo-stance.jsonl` already exists) before trusting it. Risks: early access, vendor lock-in, and unverified claims. Note too that "impartial" is not guaranteed by a model; it comes from **separating roles** (the critic is not the generator) and **using different families**.

---

## 5. Insight from the conversation: outcome type varies per idea

The maintainer's answer about deliverables: *"it depends — an HTML component for a UI idea, a doc or a repo for a knowledge-storage idea, a skill for a human/machine working method"*.

This is a product statement in itself. **An embryo that matures produces an artefact whose type depends on the idea.** Today `MATURE` leads only to fossil or to staying alive. A lab needs an exit that is not death: *graduation* into an artefact (prototype, doc, repo, skill, experiment).

---

## 6. Open questions to keep open now

Answered by the maintainer (2026-11-05), pending an ADR:

1. **External knowledge — yes.** The agent searches the web, both to **refute** (prior art, counter-evidence) and to **extend** (evidence, adjacent work). Every web claim carries its source. Still open: how to balance the two so research does not collapse into local elaboration (finding 2.3).
2. **Validation is not one process.** It depends on the idea, the proposed solution and the end user. So there is no fixed `kind` → validation recipe: the agent has to infer *how this idea should be validated* (problem definition already does part of this). Still open: whether that inferred validation plan is stored, and whether the user can edit it.
4. **Roles inside, one voice outside** (accepted). Collaborator, researcher and critic are separate roles under the hood, but the user hears **one** voice: the collaborator's single question (ADR 0002). The researcher's output arrives as sourced HITL notes or tensions. The critic's output arrives as typed gate suggestions with confidence (a candidate use for Jev). Impartiality comes from separating roles, with the critic from a different model family than the generator, not from adding voices.

3. **A success end state — yes.** When an idea is productised or used, it ends in a **third terminal state**, distinct from `MATURE` (still alive, undecided) and `FOSSIL` (path closed). The metaphor is *it has already sprouted*: the idea left the garden and lives in the world. Name: **`TRANSPLANTED`**. Still open:
   - what it stores: a link to the artefact (component, doc, repo, skill), plus *what made it work*, the success counterpart to the fossil reason;
   - whether it is immutable like a fossil (`409` on PATCH and agent) or can still receive notes when the real-world artefact evolves;
   - whether only `MATURE` can be transplanted, or any living state;
   - whether the agent may *propose* it (HITL, like fossil proposals) or only the user sets it.

Also decided (2026-11-05), see [Direction](/direction):

- **Audience:** a product for people with ideas, not the maintainer's private lab. Bounds stay loose.
- **Framing:** a *creative harness* that guides an idea to be discarded or watered as well as possible.
- **Where validation happens:** all of it — thinking and research, recorded experiments, produced artefacts — chosen by context.
- **Providers:** bring your own (Anthropic, OpenAI, Ollama local/cloud as the floor). Cursor was mentioned, but it is an editor, not a public model API. It fits better as a *destination* for transplanted artefacts (for example a skill or a repo) than as a provider.
- **Capture:** any input (image + text, link + instruction, a sentence). The root idea is extracted from it.
- **Lifecycle:** `MATURE` → `MATURING` (undergoing validation), plus terminal `TRANSPLANTED`.
- **Validation plan:** both implicit in the questions and visible/editable.

Keep open (answer with experiments):

5. Does a separate calibrated critic (Jev or another family) improve gates compared with the same LLM self-judging?
6. Does web research narrow ideas, as the evidence predicts? Measure path diversity with and without it.
7. Does variety from the personal corpus beat model variety (`VARIETY` with and without second-brain)?
8. Which classic methods earn a move, and which are theatre? Use the same test as stance: count move × state × outcome.
9. Does "lab" stay single-user, or do validations need other humans (interviews, reviewers)?

Explicitly not now: multi-user, a methods UI, autonomous agents that run without the human.

---

## 7. Suggested next experiments (smallest first)

1. **Refutation research** (one move, `GERMINATING`): the agent searches for prior art and counter-evidence; the result is a tension with sources, still one question.
2. **Jev as stance selector + seed classifier**: offline against `evals/embryo-stance.jsonl`; compare calibration with the current LLM.
3. **Graduation**: design spike only (state, artefact link). Write an ADR before code.
4. **Path tournament** in `GROWING`: pairwise debate, human as referee.

---

*Sources were gathered 2026-11-05. Vendor figures (validators, Kosmos, Jev) are self-reported and not independently verified.*

*Related: [Method as process](./method-as-process) · [Saved references as contrast](./saved-references-as-contrast) · [Open Questions](/open-questions) · [Direction](/direction)*
