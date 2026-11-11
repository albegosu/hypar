import { AGENT_MOVES, isAgentMove, type AgentMove } from '../../utils/embryo-method'
import { LIVING_STATES } from '../../utils/embryo-lab'

/** A trimmed embryo event: only the fields the aggregation reads. */
export interface ObservationEvent {
  type: string
  payload?: unknown
}

export interface Observations {
  totals: {
    embryos: number
    agentQuestions: number
    connectionsProposed: number
    connectionsAccepted: number
  }
  /** Counts of AGENT_QUESTION by (state → move). Only turns that recorded a state. */
  moveByState: Record<string, Record<AgentMove, number>>
  /** GROWING turns that produced ≥1 path, over GROWING turns that recorded it. */
  growingPaths: { withPaths: number; total: number; rate: number | null }
  /** Accepted agent-proposed connections over the number proposed. */
  connectionAccept: { accepted: number; proposed: number; rate: number | null }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? value as Record<string, unknown> : null
}

function emptyMoveRow(): Record<AgentMove, number> {
  return Object.fromEntries(AGENT_MOVES.map(m => [m, 0])) as Record<AgentMove, number>
}

/**
 * Aggregate a user's events into the signals the lab's Validation questions ask
 * for: does the move vary by state, do GROWING turns produce paths, and are
 * agent-inferred connections accepted or dismissed. Pure over the event list so
 * it stays unit-testable without a database.
 */
export function aggregateObservations(
  events: ObservationEvent[],
  opts: { embryoCount: number },
): Observations {
  const moveByState: Record<string, Record<AgentMove, number>> = Object.fromEntries(
    LIVING_STATES.map(s => [s, emptyMoveRow()]),
  )

  let agentQuestions = 0
  let growingWithPaths = 0
  let growingTotal = 0
  let connectionsProposed = 0
  let connectionsAccepted = 0

  for (const ev of events) {
    const payload = asRecord(ev.payload)

    if (ev.type === 'AGENT_QUESTION') {
      agentQuestions += 1
      const state = typeof payload?.state === 'string' ? payload.state : null
      const move = payload?.move
      if (state && moveByState[state] && isAgentMove(move)) {
        moveByState[state][move] += 1
      }
      if (state === 'GROWING' && typeof payload?.pathsCount === 'number') {
        growingTotal += 1
        if (payload.pathsCount > 0) growingWithPaths += 1
      }
    }
    else if (ev.type === 'AGENT_SUGGESTION' && payload?.kind === 'connection') {
      connectionsProposed += 1
    }
    else if (ev.type === 'CONNECTION_MADE' && payload?.fromProposal === true) {
      connectionsAccepted += 1
    }
  }

  return {
    totals: {
      embryos: opts.embryoCount,
      agentQuestions,
      connectionsProposed,
      connectionsAccepted,
    },
    moveByState,
    growingPaths: {
      withPaths: growingWithPaths,
      total: growingTotal,
      rate: growingTotal > 0 ? growingWithPaths / growingTotal : null,
    },
    connectionAccept: {
      accepted: connectionsAccepted,
      proposed: connectionsProposed,
      rate: connectionsProposed > 0 ? connectionsAccepted / connectionsProposed : null,
    },
  }
}
