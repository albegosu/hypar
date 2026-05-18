import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { validateEnv } from '../server/utils/env-validation'

describe('validateEnv', () => {
  const snapshot = { ...process.env }

  beforeEach(() => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
    process.env.BETTER_AUTH_SECRET = 'test-secret-for-validation-min-32'
    process.env.GOOGLE_API_KEY = 'test-google-key'
    delete process.env.AUTH_SECRET
    delete process.env.EMBEDDING_PROVIDER
  })

  afterEach(() => {
    process.env = { ...snapshot }
  })

  it('passes with database, auth secret, and embedding provider', () => {
    expect(() => validateEnv()).not.toThrow()
  })

  it('fails without DATABASE_URL', () => {
    delete process.env.DATABASE_URL
    expect(() => validateEnv()).toThrow(/DATABASE_URL/)
  })

  it('fails without auth secret', () => {
    delete process.env.BETTER_AUTH_SECRET
    delete process.env.AUTH_SECRET
    expect(() => validateEnv()).toThrow(/BETTER_AUTH_SECRET/)
  })

  it('fails without any embedding provider', () => {
    delete process.env.GOOGLE_API_KEY
    delete process.env.OPENAI_API_KEY
    delete process.env.VOYAGE_API_KEY
    delete process.env.OLLAMA_URL
    expect(() => validateEnv()).toThrow(/embedding provider/)
  })
})
