import { describe, it, expect } from 'vitest'
import {
  VALIDATION_PLAN_MAX,
  normalizeValidationPlan,
  planEditGuard,
  planProposalToPersist,
  shouldProposePlan,
  showPlanCard,
  validationPlanForPrompt,
} from '../utils/validation-plan'
import { buildAgentSystemPrompt, buildAgentUserMessage, parseAgentResponse } from '../server/utils/embryo-agent'

describe('normalizeValidationPlan', () => {
  it('trims, normalises newlines and clips', () => {
    expect(normalizeValidationPlan('  a\r\nb  ')).toBe('a\nb')
    expect(normalizeValidationPlan('x'.repeat(VALIDATION_PLAN_MAX + 50))).toHaveLength(VALIDATION_PLAN_MAX)
  })
  it('returns empty for non-strings', () => {
    expect(normalizeValidationPlan(null)).toBe('')
    expect(normalizeValidationPlan(42)).toBe('')
  })
})

describe('planProposalToPersist', () => {
  it('only proposes while GROWING or MATURING', () => {
    expect(shouldProposePlan('GROWING')).toBe(true)
    expect(shouldProposePlan('MATURING')).toBe(true)
    for (const s of ['LATENT', 'GERMINATING', 'FOSSIL', 'TRANSPLANTED']) {
      expect(planProposalToPersist(s, 'interview 5 users', null)).toBeNull()
    }
  })
  it('drops empty and unchanged proposals', () => {
    expect(planProposalToPersist('MATURING', '  ', null)).toBeNull()
    expect(planProposalToPersist('MATURING', 'same', ' same ')).toBeNull()
    expect(planProposalToPersist('MATURING', 'new', 'old')).toBe('new')
  })
})

describe('planEditGuard (ADR 0003, ADR 0005)', () => {
  it('allows living states, rejects fossil and transplanted', () => {
    for (const s of ['LATENT', 'GERMINATING', 'GROWING', 'MATURING']) expect(planEditGuard(s)).toBeNull()
    expect(planEditGuard('FOSSIL')).toMatch(/Fossils/)
    expect(planEditGuard('TRANSPLANTED')).toMatch(/only accept notes/)
  })
})

describe('showPlanCard', () => {
  it('always shows while MATURING, earlier only with a plan or pending proposal', () => {
    expect(showPlanCard('MATURING', null, false)).toBe(true)
    expect(showPlanCard('GROWING', null, false)).toBe(false)
    expect(showPlanCard('GROWING', 'plan', false)).toBe(true)
    expect(showPlanCard('GROWING', null, true)).toBe(true)
    expect(showPlanCard('FOSSIL', null, true)).toBe(false)
    expect(showPlanCard('TRANSPLANTED', 'plan', false)).toBe(true)
  })
})

describe('agent contract', () => {
  it('parses an additive validationPlan and keeps the single question', () => {
    const r = parseAgentResponse(JSON.stringify({ question: 'Who pays?', validationPlan: '  Interview 5 buyers.  ' }))
    expect(r.question).toBe('Who pays?')
    expect(r.validationPlan).toBe('Interview 5 buyers.')
  })
  it('defaults to null when absent or malformed', () => {
    expect(parseAgentResponse(JSON.stringify({ question: 'q' })).validationPlan).toBeNull()
    expect(parseAgentResponse(JSON.stringify({ question: 'q', validationPlan: 7 })).validationPlan).toBeNull()
    expect(parseAgentResponse('not json').validationPlan).toBeNull()
  })
  it('prompt allows a plan only as an additive field, never a second question', () => {
    const prompt = buildAgentSystemPrompt('MATURING')
    expect(prompt).toMatch(/"validationPlan"/)
    expect(prompt).toMatch(/not a second question/i)
  })
  it('shows the current plan to the agent', () => {
    expect(validationPlanForPrompt(null)).toBe('')
    const msg = buildAgentUserMessage({
      seed: 's', state: 'MATURING', openTensions: [], otherEmbryos: [], dialogue: [], validationPlan: 'Fake-door test',
    })
    expect(msg).toMatch(/Current validation plan/)
    expect(msg).toMatch(/Fake-door test/)
  })
})
