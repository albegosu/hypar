---
status: accepted
date: 2026-09-01
---

# ADR 0004: Glass visual language

- **Status:** accepted
- **Date:** 2026-09-01
- **Amended:** 2026-09-02 — shell perimeter = one framed window (opaque rim chrome) with sidebar as left wall + U-rim gutter (top/right/bottom); ambient field = luminosity-dithered `+` grid (not soft CSS × tile)

## Context

Hypar’s UI spoke in a terminal/CLI voice (mono-first chrome, CRT greens). That read as a leftover from the RAG-era reference stack. Green accents and glyph textures fought the clean product voice.

## Decision

Adopt a **monochrome glass** visual language for the Nuxt app shell and surfaces, in the same line as [resiz.es](https://www.resiz.es/):

- **Dark default**: near-black canvas (`#0b0b0b`) with a full-bleed **luminosity-dithered `+` field** (Bayer/ordered threshold per grid cell) — hard stippled smoke, not soft alpha fog or glyph ASCII
- **Light**: warm paper (`#f3f3f1`) with a quieter dithered `+` field
- **Accent = ink/paper**: near-white on dark, near-black on light. No brand green, teal, or purple
- **Ambient field**: canvas dithered `+` base (optional light vignette) + floating **liquid-glass geometries** that sample the same master — refraction is overlay, not the atmosphere
- **App chrome**: slim left icon rail as the **left wall** of the shell; content pane inset with a **U-rim** (top / right / bottom only); compact Garden/Settings float pill inside the pane — Wafer/Lexical windowed layout, not a full box border around sidebar+content, not sticky header + bottom dock
- **Glass everywhere**: panels, float nav, fluid shapes, and shell use translucent fills + refraction/blur
- **Inverted agent voice**: challenge hero renders in the opposite theme so the agent reads as another voice, not another card
- Micro-metadata in mono 10px uppercase; content in sans
- Compact radii (6/10px); pills reserved for badges/chips
- Keep theme toggle and `--term-*` variable layer for low churn

Docs/marketing VitePress can retain a distinct aesthetic; this ADR binds the **app** surfaces.

## Consequences

- New UI work stays monochrome and glass — no accent chroma unless a future ADR reopens it
- Embryo flows and APIs are unchanged — visual language only

## Sources

- [Direction](/direction) — lab north star
- [resiz.es](https://www.resiz.es/) — monochrome atmosphere + frosted surfaces
- `assets/css/main.css`, `assets/css/ai-elements-hypar.css`
