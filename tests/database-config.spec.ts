import { describe, it, expect } from 'vitest'
import { databasePoolConfig } from '../utils/database-config'

const url = 'postgresql://postgres.ref:pw@aws-0-eu-west-1.pooler.supabase.com:6543/postgres'
const pem = '-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----'

describe('databasePoolConfig', () => {
  it('passes the URL through when no CA is set', () => {
    expect(databasePoolConfig({ DATABASE_URL: url })).toEqual({ connectionString: url })
  })

  it('verifies the server certificate with DATABASE_CA_CERT', () => {
    expect(databasePoolConfig({ DATABASE_URL: url, DATABASE_CA_CERT: pem })).toEqual({
      connectionString: url,
      ssl: { ca: pem, rejectUnauthorized: true },
    })
  })

  it('accepts a PEM pasted with literal \\n', () => {
    const cfg = databasePoolConfig({ DATABASE_URL: url, DATABASE_CA_CERT: pem.replace(/\n/g, '\\n') })
    expect(cfg.ssl?.ca).toBe(pem)
  })

  it('rejects sslmode in the URL next to a CA, since it would override verification', () => {
    expect(() => databasePoolConfig({ DATABASE_URL: `${url}?sslmode=require`, DATABASE_CA_CERT: pem })).toThrow('sslmode')
  })

  it('requires DATABASE_URL', () => {
    expect(() => databasePoolConfig({})).toThrow('DATABASE_URL is not set')
  })
})
