# Experiment: saved references as contrast

> **Status:** Phase 1 implemented (2026-09): the index reaches hypar; the agent doesn't use it yet. It extends the [second-brain integration](/guide/second-brain), which today only plants seeds, and answers part of the open question [What does the agent know?](/open-questions#what-does-the-agent-know).

The agent challenges an embryo using only the garden: the seed, its tensions, the dialogue and a few peers. The user also keeps a [second-brain](https://github.com/albegosu/second-brain) wiki of interface patterns, features, tools and practices they saved from what they read. This experiment asks whether the agent can use that wiki to **press on** a growing idea, without becoming the retriever Hypar stopped being.

---

## Problem

Two failure modes pull in opposite directions.

1. **The agent argues in a vacuum.** An embryo like *"the garden should feel like a herbarium at night"* gets probed only against itself. The user has already saved six captures of glass and dither styles, and a pattern where hover reveals a preview. The agent can't ask *"your saved references do X; is your idea that, or the opposite?"*, because it doesn't know they exist.
2. **References are solution-shaped.** A saved pattern is somebody else's answer. Put it in front of the agent and the easiest question becomes *"have you tried pattern X?"*. That is the first-idea anti-pattern ([method as process](/experiments/method-as-process)) and a search engine dressed as a collaborator: the thing the RAG pivot left behind ([history](/history)).

The experiment succeeds only if (1) improves and (2) doesn't happen.

## Thesis

> A reference is a contrast, not a recommendation.

The agent may name a saved reference only to sharpen the tension: to ask how the idea differs from it, what it rejects in it, or which of two saved directions it is closer to. It never proposes adopting it.

---

## Not the same as what sparked a seed

An embryo planted from a capture already carries that capture's essence, and the agent reads it in every state. That is the embryo's own origin, needed to know what "this" in the seed refers to. This experiment is about the rest of the wiki: references the embryo didn't come from.

## Where it fits in the lifecycle

| State | Uses references? | Why |
|---|---|---|
| `LATENT` (`DEFINE`) | **No** | Naming the problem comes first. A reference here is a solution waiting to be copied. |
| `GERMINATING` (`PROBE` / `INVERT`) | **Yes** | Test an assumption against something that exists: *"this saved pattern assumes the opposite; what makes yours right?"* |
| `GROWING` (`VARIETY`) | **Yes** | Paths can come from how saved references diverge from each other, not from picking one. |
| `MATURE` (`SIMPLEST`) | **No** | Closing is about this idea's own form; new material reopens it. |
| `FOSSIL` | — | No agent input. |

---

## What the agent sees

Only the wiki's **index**: topic titles, one-line summaries and item names (patterns, styles, options, ideas), written by second-brain's model. No source notes, no quoted posts, no palettes, no URLs of third-party content. At the time of writing the index is about 13.5 KB (≈3.5k tokens) for 70 captures, so it fits in the prompt whole. No embeddings and no search, in line with both projects: add them only when the index stops fitting.

The user can see exactly what the agent saw (a collapsed `AiContext` entry: *"saved references: index from DATE"*).

## Data path

The wiki repository already holds the credentials ([second-brain guide](/guide/second-brain)), so it pushes; hypar never reads the private repository.

```
second-brain worker (after each capture commit)
   └─ PUT /api/integrations/references   Bearer hyp_…   { markdown, commit }
          └─ ReferenceIndex { userId, markdown, commit, updatedAt }   one row per user, replaced
```

Settings → integrations shows when the index was last updated and lets the user clear it.

---

## Phases

Smallest slice first. Stop after Phase 2 if the questions don't get better.

### Phase 1 — Snapshot, no agent change

- `ReferenceIndex` model and `PUT /api/integrations/references` (integration token, size cap, replaces the row).
- second-brain sends `wiki/index.md` after `commit_wiki` when `HYPAR_URL` / `HYPAR_TOKEN` are set.
- Settings shows the last update and a clear button.

**Acceptance:** a capture updates the snapshot; a token from another user can't overwrite it; clearing removes it; the agent prompt is unchanged.

### Phase 2 — Prompt only, `GERMINATING` and `GROWING`

- When a snapshot exists and the state is `GERMINATING` or `GROWING`, append a **Saved references** block to the user message and a rule to the system prompt: *a reference may be named only to contrast with the idea; never suggest adopting, using or trying it*.
- The spoken turn is still exactly one question ([ADR 0002](/decisions/0002-agent-one-question)).
- Log `payload.references: true` on the `AGENT_QUESTION` event, so turns with and without references can be compared.

**Acceptance:** `LATENT` and `MATURE` prompts contain no references; unit tests cover the block and the rule; a turn without a snapshot is byte-for-byte the current prompt.

### Phase 3 — Named reference as a HITL note (only if Phase 2 holds)

- Optional JSON field `reference: { topic, item, contrast }`, at most one per turn, validated against names that exist in the snapshot.
- Stored as a `PENDING_REFERENCE` agent note. Accept keeps it as a tension (*"contrast with ITEM: …"*); dismiss drops it. The UI shows the item name and topic only; the link opens the wiki page on GitHub.

**Acceptance:** unknown names are discarded; never more than one; never outside the two states.

### Phase 4 — Evals

Extend `evals/embryo-stance.jsonl` with rows that carry a small fixed index:

- solution-shaped seed + `LATENT` + index → still `DEFINE`, no reference named;
- assumption-laden seed + `GERMINATING` + an index holding the opposite assumption → `PROBE`/`INVERT`, question names the contrast;
- one-fix seed + `GROWING` + index with two divergent items → `VARIETY`, paths reflect the divergence;
- any row → question contains no adoption verbs aimed at a reference (*use, try, adopt, switch to, consider*).

---

## Stop conditions

- **Recommendation leak:** more than 1 in 10 reference turns in real sessions read as *"try / use X"*. Fix the prompt once; if it persists, stop and record the finding.
- **Stance drift:** `GROWING` turns with references stop being `VARIETY` more often than turns without.
- **Noise:** the user dismisses most `PENDING_REFERENCE` notes (Phase 3) over two weeks of use.
- **Cost:** the free model's latency or quota makes reference turns noticeably worse than plain ones.

## Non-goals

- Retrieval, embeddings or search over the wiki.
- Reading source notes or anything beyond the index.
- Using references in `LATENT` or `MATURE`, or on fossils.
- Creating embryos or connections from references automatically.
- Writing to the wiki from hypar (fossils flowing back as practices is a separate experiment).

## Open questions

1. Whole index, or only the categories closest to the embryo? Start whole; narrow only if it's noise.
2. Should the user be able to turn references off per embryo?
3. Does seeing *"saved references"* in the context make the user trust the question more, or less?

---

*Related: [The Agent](/concepts/agent) · [Method as process](/experiments/method-as-process) · [second-brain guide](/guide/second-brain) · [Open Questions](/open-questions)*
