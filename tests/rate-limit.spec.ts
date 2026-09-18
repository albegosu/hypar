import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { H3Event } from 'h3'

const getHeaderMock = vi.fn(() => undefined)
vi.stubGlobal('getHeader', getHeaderMock)
vi.stubGlobal('createError', (opts: { statusCode: number; statusMessage: string }) => {
  const e = new Error(opts.statusMessage) as Error & { statusCode: number }
  e.statusCode = opts.statusCode
  return e
})
vi.stubGlobal('defineEventHandler', (handler: (event: H3Event) => void) => handler)

const handler = (await import('../server/middleware/rate-limit')).default as (event: H3Event) => void

function makeEvent(path: string, method = 'POST', ip = '127.0.0.1', userId?: string): H3Event {
  return {
    path,
    method,
    context: { auth: userId ? { user: { id: userId } } : undefined },
    node: { req: { socket: { remoteAddress: ip } } },
  } as unknown as H3Event
}

describe('rate-limit middleware', () => {
  beforeEach(() => {
    getHeaderMock.mockReturnValue(undefined)
  })

  it('skips non-API paths', () => {
    const event = makeEvent('/auth/signin', 'GET')
    expect(() => handler(event)).not.toThrow()
  })

  it('skips GET requests (no matching rule)', () => {
    const event = makeEvent('/api/embryos', 'GET')
    expect(() => handler(event)).not.toThrow()
  })

  it('throws 429 after exhausting agent capacity (30 req)', () => {
    const ip = '10.0.0.81'
    const path = '/api/embryos/abc123/agent'
    for (let i = 0; i < 30; i++) {
      handler(makeEvent(path, 'POST', ip, 'agent-user'))
    }
    expect(() => handler(makeEvent(path, 'POST', ip, 'agent-user'))).toThrow('Rate limit exceeded. Please slow down.')
  })

  it('applies embryo-write rule to create / patch / fossilize / resurrect', () => {
    const ip = '10.0.0.50'
    for (let i = 0; i < 60; i++) {
      handler(makeEvent('/api/embryos', 'POST', ip, 'write-user'))
    }
    expect(() => handler(makeEvent('/api/embryos', 'POST', ip, 'write-user'))).toThrow('Rate limit exceeded')
    expect(() => handler(makeEvent('/api/embryos/x/fossilize', 'POST', ip, 'write-user'))).toThrow('Rate limit exceeded')
    expect(() => handler(makeEvent('/api/embryos/x/resurrect', 'POST', ip, 'write-user'))).toThrow('Rate limit exceeded')
  })

  it('applies the integration rule to plants but not to token management', () => {
    const ip = '10.0.0.90'
    for (let i = 0; i < 30; i++) {
      handler(makeEvent('/api/integrations/embryos', 'POST', ip))
    }
    expect(() => handler(makeEvent('/api/integrations/embryos', 'POST', ip))).toThrow('Rate limit exceeded')
    expect(() => handler(makeEvent('/api/integrations/tokens', 'POST', ip))).not.toThrow()
  })

  it('applies the integration rule to reference index pushes', () => {
    const ip = '10.0.0.91'
    for (let i = 0; i < 30; i++) {
      handler(makeEvent('/api/integrations/references', 'PUT', ip))
    }
    expect(() => handler(makeEvent('/api/integrations/references', 'PUT', ip))).toThrow('Rate limit exceeded')
    expect(() => handler(makeEvent('/api/integrations/references', 'DELETE', ip))).not.toThrow()
  })

  it('applies the telemetry rule to public beacons (60 req)', () => {
    const ip = '10.0.0.95'
    for (let i = 0; i < 60; i++) {
      handler(makeEvent('/api/vitals', 'POST', ip))
    }
    expect(() => handler(makeEvent('/api/vitals', 'POST', ip))).toThrow('Rate limit exceeded')
    // client-errors shares the telemetry rule but a different bucket label key path
    for (let i = 0; i < 60; i++) {
      handler(makeEvent('/api/client-errors', 'POST', '10.0.0.96'))
    }
    expect(() => handler(makeEvent('/api/client-errors', 'POST', '10.0.0.96'))).toThrow('Rate limit exceeded')
  })

  it('does not rate-limit removed RAG paths', () => {
    expect(() => handler(makeEvent('/api/chat', 'POST', '10.0.0.1', 'user-1'))).not.toThrow()
    expect(() => handler(makeEvent('/api/documents/upload', 'POST', '10.0.0.1', 'user-1'))).not.toThrow()
  })

  it('isolates rate limits per client key', () => {
    const path = '/api/embryos/abc/agent'
    for (let i = 0; i < 30; i++) {
      handler(makeEvent(path, 'POST', '10.0.0.70', 'user-a'))
    }
    expect(() => handler(makeEvent(path, 'POST', '10.0.0.71', 'user-b'))).not.toThrow()
  })
})
