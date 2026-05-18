import { describe, it, expect, vi, afterEach } from 'vitest'
import { logger } from '../server/utils/logger'

describe('logger', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('emits JSON with level and message', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    logger.info('hello', { requestId: 'req-1' })
    expect(spy).toHaveBeenCalledOnce()
    const parsed = JSON.parse(String(spy.mock.calls[0][0]))
    expect(parsed.level).toBe('info')
    expect(parsed.msg).toBe('hello')
    expect(parsed.requestId).toBe('req-1')
  })
})
