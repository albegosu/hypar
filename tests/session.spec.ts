import { describe, it, expect, vi } from 'vitest'

vi.stubGlobal('createError', (opts: { statusCode: number; statusMessage: string }) => {
  const e = new Error(opts.statusMessage) as Error & { statusCode: number }
  e.statusCode = opts.statusCode
  return e
})

import { requireAdminUserId, requireSessionUserId } from '../server/utils/session'
import type { H3Event } from 'h3'

describe('requireSessionUserId', () => {
  it('returns user ID when session exists', () => {
    const event = {
      context: { auth: { user: { id: 'usr_123' } } },
    } as unknown as H3Event
    expect(requireSessionUserId(event)).toBe('usr_123')
  })

  it('throws 401 when no auth context', () => {
    const event = { context: {} } as unknown as H3Event
    expect(() => requireSessionUserId(event)).toThrow('Unauthorized')
  })

  it('throws 401 when user has no ID', () => {
    const event = {
      context: { auth: { user: { id: undefined } } },
    } as unknown as H3Event
    expect(() => requireSessionUserId(event)).toThrow('Unauthorized')
  })
})

describe('requireAdminUserId', () => {
  it('returns user ID for an admin', () => {
    const event = {
      context: { auth: { user: { id: 'usr_admin', role: 'admin' } } },
    } as unknown as H3Event
    expect(requireAdminUserId(event)).toBe('usr_admin')
  })

  it('throws 403 for a non-admin user', () => {
    const event = {
      context: { auth: { user: { id: 'usr_123', role: 'user' } } },
    } as unknown as H3Event
    expect(() => requireAdminUserId(event)).toThrow('Forbidden')
  })

  it('throws 401 when unauthenticated', () => {
    const event = { context: {} } as unknown as H3Event
    expect(() => requireAdminUserId(event)).toThrow('Unauthorized')
  })
})
