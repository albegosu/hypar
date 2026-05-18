import { describe, it, expect } from 'vitest'
import { slidingWindowAllow } from '../server/utils/distributed-store'

describe('slidingWindowAllow (memory fallback)', () => {
  it('allows requests under the limit', async () => {
    const key = `test-${Date.now()}`
    expect(await slidingWindowAllow(key, 60_000, 3)).toBe(true)
    expect(await slidingWindowAllow(key, 60_000, 3)).toBe(true)
    expect(await slidingWindowAllow(key, 60_000, 3)).toBe(true)
  })

  it('blocks when over the limit', async () => {
    const key = `test-block-${Date.now()}`
    expect(await slidingWindowAllow(key, 60_000, 2)).toBe(true)
    expect(await slidingWindowAllow(key, 60_000, 2)).toBe(true)
    expect(await slidingWindowAllow(key, 60_000, 2)).toBe(false)
  })
})
