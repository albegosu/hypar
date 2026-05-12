import type { H3Event } from 'h3'

/**
 * Verify admin access. Accepts either:
 *   1. A session user with role === 'admin'
 *   2. A matching ADMIN_API_KEY header (for CI/scripts)
 */
export function requireAdmin(event: H3Event): void {
  // API key fallback for CI/scripts
  const apiKey = (useRuntimeConfig().adminApiKey as string) || ''
  if (apiKey) {
    const header = getHeader(event, 'authorization') ?? getHeader(event, 'x-admin-key') ?? ''
    const provided = header.startsWith('Bearer ') ? header.slice(7) : header
    if (provided === apiKey) return
  }

  // Role-based check via session
  const user = event.context.auth?.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (user.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
}
