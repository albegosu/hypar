# The Lifecycle

Every embryo moves through states. The lifecycle is not a progress bar — it is a signal of how alive an idea is, and what kind of engagement it needs. The lifecycle **is** the method: define, probe, generate paths, then validate. Living states change the agent's stance. The two end states record how the idea left: it died, or it worked ([ADR 0005](/decisions/0005-transplanted-and-maturing)).

## States

```
latent → germinating → growing → maturing
                                    ↓        ↓
                                 fossil   transplanted
```

### Latent

The embryo exists but the agent has not yet engaged with it. The seed has been captured. The tension is implicit — present but not yet surfaced.

A latent embryo is waiting. Opening it auto-engages the agent; the first successful turn advances it to germinating. In **Settings → agent** you can turn *engage on first open* off: the seed then waits until you press Engage.

### Germinating

The agent has begun engaging. The first questions have been asked. The embryo is aware of its own tensions.

This is the most fragile state. The idea could grow into something or reveal itself as hollow. The agent's job here is to probe without breaking — to find the genuine tension without exhausting the embryo before it has developed.

### Growing

Connections are forming. The embryo has survived initial questioning and is developing shape. Other embryos may be linking to it, or it to them. The agent may propose **paths** — alternative directions, not the answer — which you can keep as tensions or dismiss.

### Maturing

The idea is being validated. It has a clear shape, and the work is now evidence: research, experiments, artefacts, the cheapest test that could kill it. The agent asks what would prove the idea or kill it, and may propose fossilization (it failed) or transplant (it works).

A maturing embryo leaves the garden in one of two ways: [fossil](/concepts/fossils) when it dies, or **transplanted** when it works. You can still jump backward to a living state before closing. (Before ADR 0005 this state was `MATURE`.)

### Fossil

The embryo has been closed. It is no longer active, but it is not erased. A fossil retains:

- The original seed
- The full lifecycle history
- The reason for closure (always recorded)
- The connections it held at the time of closure

See [Fossils & Memory](/concepts/fossils) for the full picture.

### Transplanted

The idea worked: it was productised or is in use, and it now lives outside the garden. A transplant keeps:

- What it became (`transplantOutcome`): a link or a reference to the component, doc, repo or skill
- Why it worked (`transplantReason`, always required)
- The full lifecycle history

Only a `MATURING` embryo can be transplanted, so the idea passes through validation first. A transplanted embryo is closed to the agent and to lifecycle, tension and connection changes (`409`). You can still add **notes from outside** as the artefact evolves (`USER_NOTE` events).

---

## Transitions

### Who advances an embryo?

- **First agent engage** on a `LATENT` embryo sets `GERMINATING` (logged as `STATE_CHANGED` initiated by `AGENT`). The collaborator shows an explicit **first confrontation** moment (`latent → germinating`) — not a silent auto-advance. That is the germination trigger in the current lab. Leaving that notice is logged (`GERMINATE_NOTICE`, with how long it was on screen) so [observations](/architecture/#observations) can show how many were left unread.
- **You** can jump to any other living state from the detail page at any time (including backward). There is no adjacency graph.
- The agent does **not** suggest other lifecycle transitions. Path, fossil and transplant proposals are separate HITL notes.

### The fossilization transition

Fossilization is terminal. It always requires a reason. It is never silent.

See [Fossils & Memory](/concepts/fossils) for how fossilization works.

### The transplant transition

Transplanting is terminal too. It requires what the idea became and why it worked. You start it from a `MATURING` embryo, or accept the agent's transplant proposal and add the outcome. It is never silent.

### Reverting states

An embryo can move backward in the lifecycle if new tensions emerge. A maturing embryo can return to growing. Fossilized and transplanted embryos cannot be reverted.

**Resurrection** — `↺ resurrect` on a fossil creates a new `LATENT` embryo with a confirmed `RESURRECTS` link back to the fossil. The agent may also propose `RESURRECTS` to a fossil in context.

---

## What state signals

| State | What it means | Agent engagement |
|---|---|---|
| Latent | Waiting to name the real problem | **DEFINE** — recover the problem if the seed is already a solution |
| Germinating | Being probed | **PROBE / INVERT** — assumptions, not patches |
| Growing | Generating paths, not the answer | **VARIETY** — alternative directions; optional path proposals |
| Maturing | Validating — transplant, fossilize or keep testing | **VALIDATE** — evidence or the cheapest killing experiment; fossil or transplant proposal |
| Fossil | Path closed, reason kept | No agent input |
| Transplanted | Living outside the garden, reason kept | No agent input; user notes only |

---

*Next: [The Agent](/concepts/agent)*
