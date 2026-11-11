import { describe, it, expect } from 'vitest'
import { MockLanguageModelV3 } from 'ai/test'
import {
  MIN_CONFIDENCE,
  allowedKinds,
  buildCriticPrompt,
  confidenceBand,
  criticGuard,
  criticSuggestionSchema,
  parseCriticNote,
  parseCriticResponse,
  selectSuggestions,
  suggestionEventPayload,
  suggestionToNote,
  type CriticSuggestion,
} from '../utils/critic'
import { parseFossilNote } from '../utils/embryo-method'
import { runCritic } from '../server/utils/critic-run'

const mature = (confidence = 0.8): CriticSuggestion => ({ kind: 'MATURE', confidence, reason: 'Problem named and tested.' })
const fossil = (confidence = 0.7): CriticSuggestion => ({ kind: 'FOSSIL', fossilKind: 'WRONG_PATH', confidence, reason: 'A cron job does it.' })
const winner = (pathIndex = 0, confidence = 0.75): CriticSuggestion => ({ kind: 'PATH_WINNER', pathIndex, confidence, reason: 'Survives the tension.' })

describe('critic schema', () => {
  it('accepts the three typed suggestions', () => {
    for (const s of [mature(), fossil(), winner()]) {
      expect(criticSuggestionSchema.safeParse(s).success).toBe(true)
    }
  })

  it('rejects out-of-range confidence, unknown fossil kinds and empty reasons', () => {
    expect(criticSuggestionSchema.safeParse({ ...mature(), confidence: 1.2 }).success).toBe(false)
    expect(criticSuggestionSchema.safeParse({ ...mature(), confidence: -0.1 }).success).toBe(false)
    expect(criticSuggestionSchema.safeParse({ ...fossil(), fossilKind: 'BORING' }).success).toBe(false)
    expect(criticSuggestionSchema.safeParse({ ...mature(), reason: '  ' }).success).toBe(false)
    expect(criticSuggestionSchema.safeParse({ kind: 'TRANSPLANT', confidence: 0.9, reason: 'x' }).success).toBe(false)
  })
})

describe('parseCriticResponse', () => {
  it('reads fenced JSON and drops invalid items one by one', () => {
    const text = '```json\n' + JSON.stringify({
      suggestions: [mature(0.9), { kind: 'FOSSIL', fossilKind: 'NOPE', confidence: 0.9, reason: 'x' }, winner(1)],
    }) + '\n```'
    const out = parseCriticResponse(text)
    expect(out.map(s => s.kind)).toEqual(['MATURE', 'PATH_WINNER'])
  })

  it('returns nothing for prose, bad JSON or a wrong shape', () => {
    expect(parseCriticResponse('I think it is ready.')).toEqual([])
    expect(parseCriticResponse('{"suggestions": [')).toEqual([])
    expect(parseCriticResponse('{"suggestions": "nope"}')).toEqual([])
  })
})

describe('selectSuggestions', () => {
  it('drops kinds that do not fit the state', () => {
    expect(selectSuggestions([mature(), winner()], { state: 'MATURING', pathCount: 2 })).toEqual([])
    expect(selectSuggestions([mature()], { state: 'GERMINATING', pathCount: 0 })).toEqual([])
    expect(allowedKinds('LATENT')).toEqual([])
  })

  it('drops low confidence and out-of-range path indexes', () => {
    const out = selectSuggestions(
      [mature(MIN_CONFIDENCE - 0.01), winner(5, 0.9), winner(1, 0.6)],
      { state: 'GROWING', pathCount: 2 },
    )
    expect(out).toEqual([winner(1, 0.6)])
  })

  it('keeps the most confident per kind and sorts by confidence', () => {
    const out = selectSuggestions([winner(0, 0.5), winner(1, 0.9), mature(0.7)], { state: 'GROWING', pathCount: 2 })
    expect(out.map(s => [s.kind, s.confidence])).toEqual([['PATH_WINNER', 0.9], ['MATURE', 0.7]])
  })

  it('never keeps mature and fossil together: the more confident wins', () => {
    expect(selectSuggestions([mature(0.9), fossil(0.6)], { state: 'GROWING', pathCount: 0 }).map(s => s.kind)).toEqual(['MATURE'])
    expect(selectSuggestions([mature(0.5), fossil(0.6)], { state: 'GROWING', pathCount: 0 }).map(s => s.kind)).toEqual(['FOSSIL'])
  })
})

describe('confidence and guards', () => {
  it('bands confidence', () => {
    expect(confidenceBand(0.9)).toBe('high')
    expect(confidenceBand(0.8)).toBe('high')
    expect(confidenceBand(0.65)).toBe('medium')
    expect(confidenceBand(0.45)).toBe('low')
  })

  it('refuses closed and latent embryos', () => {
    expect(criticGuard('FOSSIL')).toBeTruthy()
    expect(criticGuard('TRANSPLANTED')).toBeTruthy()
    expect(criticGuard('LATENT')).toBeTruthy()
    expect(criticGuard('GROWING')).toBeNull()
    expect(criticGuard('MATURING')).toBeNull()
  })
})

describe('mapping to pending notes', () => {
  it('maps fossil to PENDING_FOSSIL in the existing format', () => {
    const note = suggestionToNote(fossil())
    expect(note.type).toBe('PENDING_FOSSIL')
    expect(parseFossilNote(note.content)).toEqual({ kind: 'WRONG_PATH', reason: 'A cron job does it.' })
  })

  it('round-trips mature and path-winner observations', () => {
    const m = suggestionToNote(mature(0.85))
    expect(m.type).toBe('OBSERVATION')
    expect(parseCriticNote(m.content)).toEqual({ kind: 'MATURE', confidence: 0.85, reason: 'Problem named and tested.' })

    const w = suggestionToNote(winner(1, 0.7), ['a', 'b: with colon'])
    expect(parseCriticNote(w.content)).toEqual({
      kind: 'PATH_WINNER',
      confidence: 0.7,
      pathIndex: 1,
      path: 'b',
      reason: 'with colon: Survives the tension.',
    })
  })

  it('does not parse ordinary notes', () => {
    expect(parseCriticNote('just an observation')).toBeNull()
  })

  it('records confidence and model in the event payload', () => {
    const p = suggestionEventPayload(fossil(0.9), { label: 'Anthropic', modelId: 'm' })
    expect(p).toMatchObject({ kind: 'critic', suggestion: 'FOSSIL', fossilKind: 'WRONG_PATH', confidence: 0.9, band: 'high', model: 'm' })
  })
})

describe('buildCriticPrompt', () => {
  it('lists paths only where a winner can be picked', () => {
    const base = { seed: 's', dialogue: [], openTensions: [], paths: ['one', 'two'] }
    expect(buildCriticPrompt({ ...base, state: 'GROWING' })).toContain('1. two')
    expect(buildCriticPrompt({ ...base, state: 'MATURING' })).not.toContain('Paths:')
  })
})

function mockModel(text: string) {
  return new MockLanguageModelV3({
    doGenerate: async () => ({
      content: [{ type: 'text', text }],
      finishReason: { unified: 'stop', raw: 'stop' },
      usage: {
        inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
        outputTokens: { total: 1, text: 1, reasoning: 0 },
      },
      warnings: [],
    }),
  })
}

describe('runCritic with an injected model', () => {
  const input = { seed: 'idea', state: 'GROWING', dialogue: [], openTensions: [], paths: ['a', 'b'] }

  it('returns validated, gated suggestions from the injected model', async () => {
    const model = mockModel(JSON.stringify({ suggestions: [mature(0.9), winner(1, 0.8), fossil(0.2), winner(9, 0.9)] }))
    const out = await runCritic({ model, input, timeoutMs: 5_000 })
    expect(out.map(s => s.kind)).toEqual(['MATURE', 'PATH_WINNER'])
    expect(model.doGenerateCalls).toHaveLength(1)
  })

  it('returns an empty list when the model answers with prose', async () => {
    const out = await runCritic({ model: mockModel('Looks good to me.'), input, timeoutMs: 5_000 })
    expect(out).toEqual([])
  })
})
