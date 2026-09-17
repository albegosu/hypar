import { describe, it, expect } from 'vitest'
import { countReferenceTopics, referencesForPrompt, shouldUseReferences } from '../utils/reference-index'

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

describe('shouldUseReferences', () => {
  it('allows references only while probing and opening paths', () => {
    expect(shouldUseReferences('GERMINATING')).toBe(true)
    expect(shouldUseReferences('GROWING')).toBe(true)
    expect(shouldUseReferences('LATENT')).toBe(false)
    expect(shouldUseReferences('MATURE')).toBe(false)
    expect(shouldUseReferences('FOSSIL')).toBe(false)
  })
})

describe('referencesForPrompt', () => {
  const forPrompt = referencesForPrompt(index)

  it('keeps the category sections with their topics', () => {
    expect(forPrompt).toContain('## Design')
    expect(forPrompt).toContain('- [AI Chat Interfaces]')
    expect(forPrompt).toContain('Patterns: AI Chat Interface')
  })

  it('drops the generated preamble, empty categories and recent captures', () => {
    expect(forPrompt).not.toContain('# Second brain')
    expect(forPrompt).not.toContain('Recent captures')
    expect(forPrompt).not.toContain('Voice Input Glow Effect')
    expect(forPrompt).not.toContain('## Tools')
  })

  it('clips a long index', () => {
    const long = `## Design\n\n${'- [Topic](design/t.md) — summary\n'.repeat(2000)}`
    const clipped = referencesForPrompt(long, 2000)
    expect(clipped.length).toBeLessThanOrEqual(2001)
    expect(clipped.endsWith('…')).toBe(true)
  })
})
