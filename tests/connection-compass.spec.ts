import { describe, it, expect } from 'vitest'
import {
  COMPASS_INNER_RING,
  COMPASS_OUTER_RING,
  compassEdge,
  layoutCompass,
  spreadAngles,
  type CompassNeighbor,
} from '../utils/connection-compass'

function nb(over: Partial<CompassNeighbor> & { id: string }): CompassNeighbor {
  return {
    edgeId: `e-${over.id}`,
    seed: over.id,
    state: 'GROWING',
    type: 'REINFORCES',
    inferred: false,
    inbound: false,
    note: null,
    ...over,
  }
}

describe('spreadAngles', () => {
  it('centres a single neighbour on its direction', () => {
    expect(spreadAngles(90, 1)).toEqual([90])
  })

  it('spreads symmetrically around the direction', () => {
    const angles = spreadAngles(0, 3)
    expect(angles).toEqual([-20, 0, 20])
  })

  it('tightens a crowded sector instead of spilling into the next one', () => {
    const angles = spreadAngles(0, 12)
    expect(Math.min(...angles)).toBeGreaterThanOrEqual(-36)
    expect(Math.max(...angles)).toBeLessThanOrEqual(36)
  })
})

describe('layoutCompass', () => {
  it('places each relation type in its own direction', () => {
    const placed = layoutCompass([
      nb({ id: 'r', type: 'REINFORCES' }),
      nb({ id: 'c', type: 'CONTRADICTS' }),
      nb({ id: 'x', type: 'EXTENDS' }),
      nb({ id: 's', type: 'RESURRECTS', state: 'FOSSIL' }),
    ])
    const at = (id: string) => placed.find(p => p.id === id)!
    expect(at('r').x).toBeGreaterThan(0)
    expect(at('c').x).toBeLessThan(0)
    expect(at('x').y).toBeLessThan(0)
    expect(at('s').y).toBeGreaterThan(0)
  })

  it('keeps confirmed links on the inner ring and agent hypotheses on the outer ring', () => {
    const placed = layoutCompass([
      nb({ id: 'sure' }),
      nb({ id: 'maybe', inferred: true }),
    ])
    const dist = (id: string) => {
      const p = placed.find(p => p.id === id)!
      return Math.round(Math.hypot(p.x, p.y))
    }
    expect(dist('sure')).toBe(COMPASS_INNER_RING)
    expect(dist('maybe')).toBe(COMPASS_OUTER_RING)
  })

  it('never hides a hypothesis straight behind a confirmed link of the same type', () => {
    const placed = layoutCompass([
      nb({ id: 'sure', type: 'EXTENDS' }),
      nb({ id: 'maybe', type: 'EXTENDS', inferred: true }),
    ])
    const [a, b] = placed.map(p => p.angle)
    expect(a).not.toBe(b)
  })

  it('grows the node with the lifecycle', () => {
    const placed = layoutCompass([
      nb({ id: 'a', state: 'LATENT' }),
      nb({ id: 'b', state: 'MATURING', type: 'EXTENDS' }),
    ])
    const r = (id: string) => placed.find(p => p.id === id)!.r
    expect(r('b')).toBeGreaterThan(r('a'))
  })

  it('is stable regardless of input order', () => {
    const list = [nb({ id: 'b' }), nb({ id: 'a' }), nb({ id: 'c' })]
    const one = layoutCompass(list).map(p => [p.id, p.angle])
    const two = layoutCompass([...list].reverse()).map(p => [p.id, p.angle])
    expect(new Map(one as any)).toEqual(new Map(two as any))
  })
})

describe('compassEdge', () => {
  it('trims the edge to the rims of both nodes', () => {
    const [p] = layoutCompass([nb({ id: 'r' })])
    const edge = compassEdge(p!, 24, 4)
    expect(edge.x1).toBeCloseTo(28)
    expect(edge.x2).toBeCloseTo(COMPASS_INNER_RING - p!.r - 4)
    expect(edge.y1).toBeCloseTo(0)
  })
})
