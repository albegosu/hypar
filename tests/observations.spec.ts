import { describe, it, expect } from 'vitest'
import { aggregateObservations, type ObservationEvent } from '../server/utils/observations'

function q(state?: string, move?: string, pathsCount?: number): ObservationEvent {
  return { type: 'AGENT_QUESTION', payload: { question: 'x', state, move, pathsCount } }
}

describe('aggregateObservations', () => {
  it('returns zeros and null rates for no events', () => {
    const obs = aggregateObservations([], { embryoCount: 3 })
    expect(obs.totals).toEqual({ embryos: 3, agentQuestions: 0, connectionsProposed: 0, connectionsAccepted: 0 })
    expect(obs.growingPaths.rate).toBeNull()
    expect(obs.connectionAccept.rate).toBeNull()
    expect(obs.moveByState.GROWING.PROBE).toBe(0)
  })

  it('counts move by state and skips turns without a state', () => {
    const obs = aggregateObservations([
      q('LATENT', 'DEFINE'),
      q('GERMINATING', 'PROBE'),
      q('GROWING', 'VARIETY', 2),
      q(undefined, 'PROBE'), // legacy event without a state — ignored in matrix
    ], { embryoCount: 1 })

    expect(obs.totals.agentQuestions).toBe(4)
    expect(obs.moveByState.LATENT.DEFINE).toBe(1)
    expect(obs.moveByState.GERMINATING.PROBE).toBe(1)
    expect(obs.moveByState.GROWING.VARIETY).toBe(1)
  })

  it('ignores an invalid move value', () => {
    const obs = aggregateObservations([q('LATENT', 'NONSENSE')], { embryoCount: 1 })
    const latentTotal = Object.values(obs.moveByState.LATENT).reduce((a, b) => a + b, 0)
    expect(latentTotal).toBe(0)
    expect(obs.totals.agentQuestions).toBe(1)
  })

  it('computes the GROWING path-fill rate only over turns that recorded it', () => {
    const obs = aggregateObservations([
      q('GROWING', 'VARIETY', 2),
      q('GROWING', 'VARIETY', 0),
      q('GROWING', 'VARIETY'), // no pathsCount — excluded from the denominator
      q('GERMINATING', 'PROBE', 0), // non-GROWING — excluded
    ], { embryoCount: 1 })

    expect(obs.growingPaths).toEqual({ withPaths: 1, total: 2, rate: 0.5 })
  })

  it('derives connection accept rate from proposal and acceptance events', () => {
    const events: ObservationEvent[] = [
      { type: 'AGENT_SUGGESTION', payload: { kind: 'connection', targetId: 'a' } },
      { type: 'AGENT_SUGGESTION', payload: { kind: 'connection', targetId: 'b' } },
      { type: 'AGENT_SUGGESTION', payload: { kind: 'paths', paths: ['x'] } }, // not a connection
      { type: 'CONNECTION_MADE', payload: { fromProposal: true, targetId: 'a' } },
      { type: 'CONNECTION_MADE', payload: { targetId: 'c' } }, // user-drawn, not from a proposal
    ]
    const obs = aggregateObservations(events, { embryoCount: 1 })
    expect(obs.connectionAccept).toEqual({ accepted: 1, proposed: 2, rate: 0.5 })
    expect(obs.totals.connectionsProposed).toBe(2)
    expect(obs.totals.connectionsAccepted).toBe(1)
  })
})
