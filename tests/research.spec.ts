import { describe, it, expect } from 'vitest'
import {
  MAX_FINDINGS,
  anthropicSearchVersion,
  buildResearchPrompt,
  normalizeUrl,
  parseResearchFindings,
  researchLean,
  shouldAutoResearch,
} from '../utils/research'

const finding = (url: string, stance = 'REFUTE') => ({
  stance,
  claim: 'A tool already does this for teams.',
  question: 'What makes yours different for a solo user?',
  url,
  title: 'Example',
})

describe('research findings', () => {
  it('keeps only findings whose URL the search returned', () => {
    const text = JSON.stringify({ findings: [finding('https://a.com/post/'), finding('https://invented.com/x')] })
    const out = parseResearchFindings(text, ['https://a.com/post#section'])
    expect(out).toHaveLength(1)
    expect(out[0]!.url).toBe('https://a.com/post/')
  })

  it('passes nothing without known sources', () => {
    const text = JSON.stringify({ findings: [finding('https://a.com')] })
    expect(parseResearchFindings(text, [])).toEqual([])
  })

  it('drops bad stances, empty fields, unsafe and duplicate URLs', () => {
    const text = JSON.stringify({
      findings: [
        finding('https://a.com', 'MAYBE'),
        { ...finding('https://b.com'), claim: '' },
        finding('javascript:alert(1)'),
        finding('https://c.com', 'EXTEND'),
        finding('https://c.com/', 'REFUTE'),
      ],
    })
    const out = parseResearchFindings(text, ['https://a.com', 'https://b.com', 'https://c.com'])
    expect(out.map(f => [f.stance, f.url])).toEqual([['EXTEND', 'https://c.com/']])
  })

  it('tolerates fences and prose around the JSON, and caps the count', () => {
    const urls = Array.from({ length: 6 }, (_, i) => `https://s${i}.com`)
    const text = `Here you go:\n\`\`\`json\n${JSON.stringify({ findings: urls.map(u => finding(u)) })}\n\`\`\``
    expect(parseResearchFindings(text, urls)).toHaveLength(MAX_FINDINGS)
    expect(parseResearchFindings('not json', urls)).toEqual([])
  })

  it('normalizes URLs for comparison', () => {
    expect(normalizeUrl('https://Example.com/a/#x')).toBe('https://example.com/a')
    expect(normalizeUrl('ftp://example.com')).toBeNull()
  })
})

describe('research timing and prompt', () => {
  const at = (m: number) => new Date(2026, 10, 5, 10, m)

  it('auto-researches once per auto state', () => {
    const created = [{ type: 'CREATED', createdAt: at(0) }, { type: 'STATE_CHANGED', createdAt: at(1) }]
    expect(shouldAutoResearch('GERMINATING', created)).toBe(true)
    expect(shouldAutoResearch('GERMINATING', [...created, { type: 'RESEARCHED', createdAt: at(2) }])).toBe(false)
    expect(shouldAutoResearch('MATURING', [...created, { type: 'RESEARCHED', createdAt: at(2) }, { type: 'STATE_CHANGED', createdAt: at(3) }])).toBe(true)
    expect(shouldAutoResearch('GROWING', created)).toBe(false)
    expect(shouldAutoResearch('LATENT', created)).toBe(false)
  })

  it('leans by state and keeps the user out of the prompt only as replies', () => {
    expect(researchLean('GERMINATING')).toMatch(/REFUTE/)
    expect(researchLean('GROWING')).toMatch(/EXTEND/)
    const prompt = buildResearchPrompt({
      seed: 'a garden for ideas',
      state: 'GROWING',
      dialogue: [{ role: 'agent', text: 'why?' }, { role: 'user', text: 'because notes rot' }],
      openTensions: ['who pays?'],
    })
    expect(prompt).toContain('Idea: a garden for ideas')
    expect(prompt).toContain('- because notes rot')
    expect(prompt).not.toContain('why?')
    expect(prompt).toContain('- who pays?')
  })

  it('picks the Anthropic search tool version by model', () => {
    expect(anthropicSearchVersion('claude-opus-5-5')).toBe('20260209')
    expect(anthropicSearchVersion('claude-sonnet-4-6')).toBe('20260209')
    expect(anthropicSearchVersion('claude-haiku-4-5')).toBe('20250305')
  })
})
