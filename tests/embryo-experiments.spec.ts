import { describe, it, expect } from 'vitest'
import {
  experimentActionGuard,
  experimentStatusAfter,
  experimentWriteGuard,
  normalizeEvidence,
  supportingExperiments,
} from '../utils/embryo-experiments'

describe('experimentWriteGuard (ADR 0012)', () => {
  it('allows living states', () => {
    for (const s of ['LATENT', 'GERMINATING', 'GROWING', 'MATURING']) {
      expect(experimentWriteGuard(s)).toBeNull()
    }
  })
  it('rejects fossils and transplanted embryos', () => {
    expect(experimentWriteGuard('FOSSIL')).toMatch(/Fossils/)
    expect(experimentWriteGuard('TRANSPLANTED')).toMatch(/only accept notes/)
  })
})

describe('experimentActionGuard', () => {
  it('starts only planned experiments', () => {
    expect(experimentActionGuard('PLANNED', 'start')).toBeNull()
    expect(experimentActionGuard('RUNNING', 'start')).toMatch(/Only planned/)
  })
  it('concludes planned or running, never concluded', () => {
    expect(experimentActionGuard('PLANNED', 'conclude')).toBeNull()
    expect(experimentActionGuard('RUNNING', 'conclude')).toBeNull()
    expect(experimentActionGuard('CONCLUDED', 'conclude')).toMatch(/immutable/)
  })
  it('supersedes anything but superseded; superseded is terminal', () => {
    for (const s of ['PLANNED', 'RUNNING', 'CONCLUDED']) {
      expect(experimentActionGuard(s, 'supersede')).toBeNull()
    }
    for (const a of ['start', 'conclude', 'supersede'] as const) {
      expect(experimentActionGuard('SUPERSEDED', a)).toMatch(/closed/)
    }
  })
  it('maps actions to the next status', () => {
    expect(experimentStatusAfter('start')).toBe('RUNNING')
    expect(experimentStatusAfter('conclude')).toBe('CONCLUDED')
    expect(experimentStatusAfter('supersede')).toBe('SUPERSEDED')
  })
})

describe('normalizeEvidence', () => {
  it('keeps notes, drops empty items and unsafe links', () => {
    expect(normalizeEvidence([
      { note: ' a ', url: 'https://x.dev/p' },
      { note: 'b', url: 'javascript:alert(1)' },
      { note: '  ' },
      'nope',
    ])).toEqual([{ note: 'a', url: 'https://x.dev/p' }, { note: 'b' }])
  })
  it('caps the list and tolerates non-arrays', () => {
    expect(normalizeEvidence(null)).toEqual([])
    expect(normalizeEvidence(Array.from({ length: 20 }, () => ({ note: 'x' })))).toHaveLength(10)
  })
})

describe('supportingExperiments', () => {
  it('returns concluded experiments that support the idea', () => {
    const list = [
      { status: 'CONCLUDED', verdict: 'SUPPORTS' },
      { status: 'CONCLUDED', verdict: 'REFUTES' },
      { status: 'SUPERSEDED', verdict: 'SUPPORTS' },
      { status: 'RUNNING', verdict: null },
    ]
    expect(supportingExperiments(list)).toHaveLength(1)
  })
})
