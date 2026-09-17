import { describe, it, expect } from 'vitest'
import {
  buildAgentSystemPrompt,
  hasSourceContext,
  buildAgentUserMessage,
  dialogueFromEvents,
  extractPartialQuestion,
  parseAgentResponse,
} from '../server/utils/embryo-agent'

describe('parseAgentResponse', () => {
  it('parses a clean JSON object', () => {
    const parsed = parseAgentResponse(JSON.stringify({
      question: 'What would make this false?',
      connections: [
        { targetId: 'abc', type: 'CONTRADICTS', reason: 'Opposite claim' },
      ],
    }))
    expect(parsed.question).toBe('What would make this false?')
    expect(parsed.move).toBeUndefined()
    expect(parsed.paths).toEqual([])
    expect(parsed.fossil).toBeNull()
    expect(parsed.connections).toEqual([
      { targetId: 'abc', type: 'CONTRADICTS', reason: 'Opposite claim' },
    ])
  })

  it('keeps a valid move and drops an unknown one without failing the turn', () => {
    expect(parseAgentResponse('{"question":"Why?","move":"DEFINE"}').move).toBe('DEFINE')
    expect(parseAgentResponse('{"question":"Why?","move":"NOPE"}').move).toBeUndefined()
    expect(parseAgentResponse('{"question":"Why?"}').question).toBe('Why?')
  })

  it('caps paths at three and ignores non-arrays', () => {
    const parsed = parseAgentResponse(JSON.stringify({
      question: 'Which path is still unnamed?',
      move: 'VARIETY',
      paths: ['template stories', 'definition of ready', 'pair with PM', 'fourth dropped'],
    }))
    expect(parsed.paths).toEqual(['template stories', 'definition of ready', 'pair with PM'])
  })

  it('parses a fossil proposal and rejects a malformed one', () => {
    const ok = parseAgentResponse(JSON.stringify({
      question: 'Is this the simplest form?',
      move: 'SIMPLEST',
      fossil: { kind: 'WRONG_PATH', reason: 'a cheaper path exists' },
    }))
    expect(ok.fossil).toEqual({ kind: 'WRONG_PATH', reason: 'a cheaper path exists' })

    const bad = parseAgentResponse(JSON.stringify({
      question: 'Done?',
      fossil: { kind: 'NOPE', reason: 'x' },
    }))
    expect(bad.fossil).toBeNull()
  })

  it('keeps RESURRECTS and coerces unknown connection types', () => {
    const resurrect = parseAgentResponse('{"question":"Why now?","connections":[{"targetId":"x","type":"RESURRECTS","reason":"old idea"}]}')
    expect(resurrect.connections[0]?.type).toBe('RESURRECTS')

    const parsed = parseAgentResponse('```json\n{"question":"Why?","connections":[{"targetId":"x","type":"NOPE","reason":"guess"}]}\n```')
    expect(parsed.question).toBe('Why?')
    expect(parsed.connections[0]?.type).toBe('EXTENDS')
  })

  it('falls back to raw text when JSON is invalid', () => {
    const parsed = parseAgentResponse('Just a question?')
    expect(parsed.question).toBe('Just a question?')
    expect(parsed.connections).toEqual([])
    expect(parsed.paths).toEqual([])
    expect(parsed.fossil).toBeNull()
  })
})

describe('extractPartialQuestion', () => {
  it('reads a complete question field from a partial object', () => {
    expect(extractPartialQuestion('{"question":"What is the real problem?","move":')).toBe(
      'What is the real problem?',
    )
  })

  it('returns the in-progress string before the closing quote', () => {
    expect(extractPartialQuestion('{"question":"What is the re')).toBe('What is the re')
  })

  it('returns null until the question key appears', () => {
    expect(extractPartialQuestion('{"move":"DEFINE"')).toBeNull()
  })
})

describe('dialogueFromEvents', () => {
  it('keeps agent questions and user replies in order', () => {
    const turns = dialogueFromEvents([
      { type: 'CREATED' },
      { type: 'AGENT_QUESTION', payload: { question: 'Why this, not that?' } },
      { type: 'USER_RESPONSE', payload: { reply: 'Because X.' } },
      { type: 'AGENT_QUESTION', payload: { question: 'And if X fails?' } },
    ])
    expect(turns).toEqual([
      { role: 'agent', text: 'Why this, not that?' },
      { role: 'user', text: 'Because X.' },
      { role: 'agent', text: 'And if X fails?' },
    ])
  })

  it('skips empty payloads', () => {
    expect(dialogueFromEvents([
      { type: 'AGENT_QUESTION', payload: {} },
      { type: 'USER_RESPONSE', payload: { reply: '  ' } },
    ])).toEqual([])
  })
})

describe('buildAgentUserMessage', () => {
  it('includes seed, tensions, prior exchange, and other embryos', () => {
    const message = buildAgentUserMessage({
      seed: 'Notes are the wrong unit.',
      state: 'GERMINATING',
      openTensions: ['Is a seed too small?'],
      dialogue: [
        { role: 'agent', text: 'What dies if this is wrong?' },
        { role: 'user', text: 'The garden metaphor.' },
      ],
      otherEmbryos: [{ id: 'e2', seed: 'Fossils need strata.', state: 'GROWING' }],
    })
    expect(message).toContain('Embryo: Notes are the wrong unit.')
    expect(message).toContain('Current state: GERMINATING')
    expect(message).toContain('Is a seed too small?')
    expect(message).toContain('You asked: What dies if this is wrong?')
    expect(message).toContain('User replied: The garden metaphor.')
    expect(message).toContain('[e2] Fossils need strata. (GROWING)')
  })

  it('includes latent state so DEFINE can run on first capture', () => {
    const message = buildAgentUserMessage({
      seed: 'A lone seed.',
      state: 'LATENT',
      openTensions: [],
      dialogue: [],
      otherEmbryos: [],
    })
    expect(message).toContain('Embryo: A lone seed.')
    expect(message).toContain('Current state: LATENT')
    expect(message).not.toContain('Prior exchange')
  })
})

describe('what sparked the seed', () => {
  const base = { seed: 'I think this would be great for hypar', state: 'LATENT', openTensions: [], dialogue: [], otherEmbryos: [] }

  it('shows the capture as context, apart from the seed', () => {
    const message = buildAgentUserMessage({
      ...base,
      source: { title: 'Interactive Component Preview Hover', context: 'Hovering a card plays its animation.' },
    })
    expect(message).toContain('Embryo: I think this would be great for hypar')
    expect(message).toContain('What sparked this seed (something the user saved; context, not the idea):')
    expect(message).toContain('Interactive Component Preview Hover\n\nHovering a card plays its animation.')
  })

  it('clips a long essence', () => {
    const message = buildAgentUserMessage({ ...base, source: { context: `${'line of detail\n'.repeat(1000)}` } })
    expect(message.length).toBeLessThan(5000)
    expect(message).toContain('…')
  })

  it('leaves the message and the system prompt unchanged without a source', () => {
    expect(buildAgentUserMessage({ ...base, source: { title: ' ', context: null } })).toBe(buildAgentUserMessage(base))
    expect(hasSourceContext({ title: null, context: '' })).toBe(false)
    expect(buildAgentSystemPrompt('LATENT', { sparked: false })).toBe(buildAgentSystemPrompt('LATENT'))
    expect(buildAgentSystemPrompt('LATENT')).not.toContain('What sparked this seed')
  })

  it('tells the agent not to recommend the saved thing when sparked', () => {
    const prompt = buildAgentSystemPrompt('LATENT', { sparked: true })
    expect(prompt).toContain('never suggest adopting, copying or building it')
    expect(prompt).toContain('Preferred move: DEFINE')
  })
})

describe('buildAgentSystemPrompt', () => {
  it('injects stance for the current state', () => {
    const latent = buildAgentSystemPrompt('LATENT')
    expect(latent).toContain('Preferred move: DEFINE')
    expect(latent).toContain('Current embryo state: LATENT')
    expect(latent).toMatch(/papering over/)

    const growing = buildAgentSystemPrompt('GROWING')
    expect(growing).toContain('Preferred move: VARIETY')
    expect(growing).toMatch(/Generate paths/)
  })
})
