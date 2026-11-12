import type { ConnectionType, EmbryoState } from '~/stores/embryos'

/**
 * Connection compass: the embryo sits at the centre and each neighbour is placed
 * so that its position carries meaning.
 *
 * - Direction = relation type (extends up, reinforces right, resurrects down, contradicts left).
 * - Distance = trust: user-confirmed links on the inner ring, agent hypotheses on the outer ring.
 * - Radius = how far the neighbour has grown.
 */

export const COMPASS_DIRECTIONS: Record<ConnectionType, number> = {
  EXTENDS: -90,
  REINFORCES: 0,
  RESURRECTS: 90,
  CONTRADICTS: 180,
}

export const COMPASS_INNER_RING = 92
export const COMPASS_OUTER_RING = 152

/** Half-width (degrees) of the sector each relation type may use. */
const SECTOR_HALF = 36
/** Preferred angular gap between neighbours on the same ring and sector. */
const PREFERRED_STEP = 18

const STATE_RADIUS: Record<EmbryoState, number> = {
  LATENT: 9,
  GERMINATING: 11,
  GROWING: 13,
  MATURING: 15,
  FOSSIL: 11,
  TRANSPLANTED: 14,
}

export interface CompassNeighbor {
  id: string
  edgeId: string
  seed: string
  state: EmbryoState
  type: ConnectionType
  /** Agent-detected and not yet confirmed by the user. */
  inferred: boolean
  /** The other embryo points at this one. */
  inbound: boolean
  note: string | null
}

export interface CompassPlacement extends CompassNeighbor {
  /** Offset from the centre, in SVG units. */
  x: number
  y: number
  r: number
  angle: number
}

export function compassNodeRadius(state: EmbryoState): number {
  return STATE_RADIUS[state]
}

/**
 * Spread `count` angles evenly around `center`, keeping them inside the sector.
 * A crowded sector tightens the step instead of spilling into its neighbours.
 */
export function spreadAngles(center: number, count: number): number[] {
  if (count <= 0) return []
  if (count === 1) return [center]
  const step = Math.min(PREFERRED_STEP, (SECTOR_HALF * 2) / (count - 1))
  const start = center - (step * (count - 1)) / 2
  return Array.from({ length: count }, (_, i) => start + step * i)
}

export function layoutCompass(neighbors: CompassNeighbor[]): CompassPlacement[] {
  const groups = new Map<string, CompassNeighbor[]>()
  for (const nb of neighbors) {
    const key = `${nb.type}:${nb.inferred ? 'outer' : 'inner'}`
    const list = groups.get(key) ?? []
    list.push(nb)
    groups.set(key, list)
  }

  const placed: CompassPlacement[] = []
  for (const list of groups.values()) {
    const first = list[0]!
    const ring = first.inferred ? COMPASS_OUTER_RING : COMPASS_INNER_RING
    // Stable order so a refetch does not shuffle the map.
    const sorted = [...list].sort((a, b) => a.id.localeCompare(b.id))
    const angles = spreadAngles(COMPASS_DIRECTIONS[first.type], sorted.length)
    sorted.forEach((nb, i) => {
      const angle = angles[i]!
      const rad = (angle * Math.PI) / 180
      placed.push({
        ...nb,
        angle,
        x: Math.round(Math.cos(rad) * ring * 10) / 10,
        y: Math.round(Math.sin(rad) * ring * 10) / 10,
        r: compassNodeRadius(nb.state),
      })
    })
  }
  return placed
}

/** Points where an edge leaves the centre node and reaches a neighbour, trimmed to both rims. */
export function compassEdge(p: CompassPlacement, centerRadius: number, gap = 4) {
  const len = Math.hypot(p.x, p.y) || 1
  const ux = p.x / len
  const uy = p.y / len
  const start = centerRadius + gap
  const end = len - p.r - gap
  return {
    x1: ux * start,
    y1: uy * start,
    x2: ux * end,
    y2: uy * end,
  }
}
