export interface DatabasePoolConfig {
  connectionString: string
  ssl?: { ca: string; rejectUnauthorized: true }
}

/**
 * Pool settings for @prisma/adapter-pg. With DATABASE_CA_CERT (a PEM, e.g. the
 * Supabase CA) the connection is encrypted and the server certificate verified.
 * An `sslmode` in the URL would override this object, so it's rejected.
 */
export function databasePoolConfig(env: Record<string, string | undefined>): DatabasePoolConfig {
  const connectionString = env.DATABASE_URL?.trim()
  if (!connectionString) throw new Error('DATABASE_URL is not set')

  const ca = env.DATABASE_CA_CERT?.trim()
  if (!ca) return { connectionString }

  if (/[?&]sslmode=/i.test(connectionString)) {
    throw new Error('Remove sslmode from DATABASE_URL when DATABASE_CA_CERT is set: it would override certificate verification')
  }
  return { connectionString, ssl: { ca: ca.replace(/\\n/g, '\n'), rejectUnauthorized: true } }
}
