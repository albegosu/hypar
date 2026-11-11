import { describe, it, expect } from 'vitest'
import { shouldShowGardenEmpty, GARDEN_OUTCOMES } from '../utils/garden-empty'

const base = { loaded: true, loading: false, error: null, total: 0 }

describe('shouldShowGardenEmpty', () => {
  it('shows only for a loaded, errorless, empty garden', () => {
    expect(shouldShowGardenEmpty(base)).toBe(true)
  })
  it('stays hidden before the first fetch settles', () => {
    expect(shouldShowGardenEmpty({ ...base, loaded: false })).toBe(false)
    expect(shouldShowGardenEmpty({ ...base, loading: true })).toBe(false)
  })
  it('stays hidden on error or once any embryo exists', () => {
    expect(shouldShowGardenEmpty({ ...base, error: 'x' })).toBe(false)
    expect(shouldShowGardenEmpty({ ...base, total: 1 })).toBe(false)
  })
})

describe('GARDEN_OUTCOMES', () => {
  it('covers alive, fossil and transplanted', () => {
    expect([...GARDEN_OUTCOMES]).toEqual(['alive', 'fossil', 'transplanted'])
  })
})
