import { describe, it, expect } from 'vitest'
import {
  TOKEN_PREFIX,
  bearerToken,
  generateIntegrationToken,
  hashIntegrationToken,
} from '../server/utils/integration-token'
import { safeHttpUrl } from '../utils/safe-url'

describe('integration tokens', () => {
  it('generates distinct prefixed tokens', () => {
    const a = generateIntegrationToken()
    const b = generateIntegrationToken()
    expect(a.startsWith(TOKEN_PREFIX)).toBe(true)
    expect(a).not.toBe(b)
    expect(a.length).toBeGreaterThan(40)
  })

  it('hashes deterministically without keeping the token', () => {
    const token = generateIntegrationToken()
    const hash = hashIntegrationToken(token)
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
    expect(hashIntegrationToken(token)).toBe(hash)
    expect(hash).not.toContain(token)
  })

  it('reads only hypar bearer tokens', () => {
    expect(bearerToken('Bearer hyp_abc')).toBe('hyp_abc')
    expect(bearerToken('bearer hyp_abc ')).toBe('hyp_abc')
    expect(bearerToken('Bearer sk-other')).toBeNull()
    expect(bearerToken('hyp_abc')).toBeNull()
    expect(bearerToken(undefined)).toBeNull()
  })
})

describe('safeHttpUrl', () => {
  it('keeps http(s) links', () => {
    expect(safeHttpUrl('https://x.com/a/status/1')).toBe('https://x.com/a/status/1')
  })

  it('drops anything that could run or is not a URL', () => {
    expect(safeHttpUrl('javascript:alert(1)')).toBeNull()
    expect(safeHttpUrl('sources/2026-09/0001-a.md')).toBeNull()
    expect(safeHttpUrl('')).toBeNull()
    expect(safeHttpUrl(null)).toBeNull()
  })
})
