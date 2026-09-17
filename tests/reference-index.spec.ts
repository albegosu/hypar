import { describe, it, expect } from 'vitest'
import { countReferenceTopics } from '../utils/reference-index'

const index = `# Second brain

## Design

_UI patterns, interactions, motion and visual styles_

- [AI Chat Interfaces](design/ai-chat-interfaces.md) — UI patterns for prompts (9 sources)
  Patterns: AI Chat Interface · Composer Attachment Carousel
- [Layout Transitions](design/layout-transitions.md) — Spatial continuity (10 sources · used 2×)

## Tools

_Nothing yet._

## Recent captures

- 2026-09-17 · [Voice Input Glow Effect](sources/2026-09/0070-voice-input-glow-effect.md) → design/style-glass
`

describe('countReferenceTopics', () => {
  it('counts topic lines, not patterns or recent captures', () => {
    expect(countReferenceTopics(index)).toBe(2)
  })

  it('is zero for an empty wiki', () => {
    expect(countReferenceTopics('# Second brain\n\n_Nothing yet._\n')).toBe(0)
  })
})
