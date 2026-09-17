import { createHash, randomBytes } from 'node:crypto'

export const TOKEN_PREFIX = 'hyp_'

export function generateIntegrationToken(): string {
  return TOKEN_PREFIX + randomBytes(32).toString('base64url')
}

export function hashIntegrationToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/** The token from `Authorization: Bearer hyp_…`, or null when the header holds anything else. */
export function bearerToken(header: string | undefined | null): string | null {
  const match = header?.match(/^Bearer\s+(\S+)\s*$/i)
  const token = match?.[1]
  return token?.startsWith(TOKEN_PREFIX) ? token : null
}
