import type { H3Event } from 'h3'

/**
 * Verify admin auth header. Throws 401 unless ADMIN_API_KEY is set in config
 * AND the caller provides a matching `Authorization: Bearer <key>` or
 * `x-admin-key: <key>` header.
 *
 * If ADMIN_API_KEY is empty, all admin endpoints are denied — never opened.
 */
export function requireAdmin(event: H3Event): void {
  const key = (useRuntimeConfig().adminApiKey as string) || ''
  if (!key) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Admin API disabled (ADMIN_API_KEY not set)',
    })
  }
  const auth = getHeader(event, 'authorization') ?? getHeader(event, 'x-admin-key') ?? ''
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : auth
  if (provided !== key) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}
