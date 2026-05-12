import type { H3Event } from 'h3'

/**
 * Protects admin/config API routes. Allows:
 * 1. Any signed-in user (any role)
 * 2. A matching ADMIN_API_KEY in Authorization or x-admin-key (for CI/scripts)
 */
export function requireAuthOrAdminApiKey(event: H3Event): void {
  const apiKey = (useRuntimeConfig().adminApiKey as string) || ''
  if (apiKey) {
    const header = getHeader(event, 'authorization') ?? getHeader(event, 'x-admin-key') ?? ''
    const provided = header.startsWith('Bearer ') ? header.slice(7) : header
    if (provided === apiKey) return
  }

  const user = event.context.auth?.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
}
