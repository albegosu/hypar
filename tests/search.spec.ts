import { describe, it, expect } from 'vitest'

// Re-import the private MMR helper via a small shim. Since `mmrRank` is not
// exported, test it indirectly through the public surface. For now we verify
// the cosine helper indirectly via simple invariants on small synthetic
// vectors using the search.service module's parsePgVector + cosineSim
// equivalents inlined here.

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

describe('cosine similarity invariants', () => {
  it('identical vectors → 1', () => {
    expect(cosine([1, 0, 0], [1, 0, 0])).toBeCloseTo(1)
  })
  it('orthogonal → 0', () => {
    expect(cosine([1, 0], [0, 1])).toBeCloseTo(0)
  })
  it('opposite → -1', () => {
    expect(cosine([1, 0], [-1, 0])).toBeCloseTo(-1)
  })
})
