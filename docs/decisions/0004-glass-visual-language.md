---
status: accepted
date: 2026-09-01
---

# ADR 0004: Glass visual language

- **Status:** accepted
- **Date:** 2026-09-01

## Context

Hypar’s UI spoke in a terminal/CLI voice (mono-first chrome, `$ command` panel headers, CRT greens). That read as a leftover from the RAG-era reference stack, not as the product voice for the embryo lab. Light and dark theme tokens still existed, but both felt “terminal with a palette swap.”

## Decision

Adopt a **"herbario nocturno"** visual language (refinement of the initial glass + rounded pass) for the Nuxt app shell and surfaces:

- **Light = pliego de herbario**: warm paper canvas, ink text, opaque cards with hairline borders and minimal shadow — no blur, no pastel washes
- **Dark = invernadero de noche**: deep moss-charcoal atmosphere, dark hairline glass panels, white primary CTAs; discreet live-state glow (e.g. growing)
- **Inverted agent voice**: the agent challenge hero renders in the *opposite* theme (ink-on-paper block in light, paper-on-night block in dark) so the agent reads as another voice, not another card
- Micro-metadata (panel headers, state badges, lifecycle steps) in mono 10px uppercase with tracking; content in sans
- Subtle film-grain overlay on the canvas; radii 12/18px (no bubbly 24px); rounded-rect buttons, pills reserved for badges/chips
- Keep the existing theme toggle (`useTerminalPrefs` / `AppHeader`) — both modes share the same structure
- Keep the CSS variable layer (`--term-*` under `.terminal-theme`) for low churn; values change, names can migrate later (new: `--term-voice-*` for the inverted agent surface)

Docs/marketing VitePress can retain a distinct aesthetic; this ADR binds the **app** surfaces.

## Consequences

- New UI work should use glass tokens and clean sans labels, not invent CLI panel headers
- Embryo flows and APIs are unchanged — visual language only
- Further embryo-detail layout hierarchy work may iterate without reopening this decision

## Sources

- [Direction](/direction) — lab north star; visual language is a settled product choice
- `assets/css/main.css`, `assets/css/ai-elements-hypar.css` — token and surface implementation
- `components/AppHeader.vue` — theme toggle wiring
