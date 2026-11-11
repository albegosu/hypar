/** First-use garden: explain the harness only while there is nothing to show. */
export interface GardenEmptyInput {
  /** True once the first fetch has settled (avoids a flash before data arrives). */
  loaded: boolean
  loading: boolean
  error: string | null
  total: number
}

export function shouldShowGardenEmpty({ loaded, loading, error, total }: GardenEmptyInput): boolean {
  return loaded && !loading && !error && total === 0
}

/** The ways an idea can end up, in plain words (keys under `garden.empty.outcomes.*`). */
export const GARDEN_OUTCOMES = ['alive', 'fossil', 'transplanted'] as const
export type GardenOutcome = (typeof GARDEN_OUTCOMES)[number]
