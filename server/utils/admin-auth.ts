import type { H3Event } from 'h3'
import { safeCompareStrings } from './settings.service'

function checkAdminApiKey(event: H3Event): boolean {
  const apiKey = (useRuntimeConfig().adminApiKey as string) || ''
  if (!apiKey) return false
  const header = getHeader(event, 'authorization') ?? getHeader(event, 'x-admin-key') ?? ''
  const provided = header.startsWith('Bearer ') ? header.slice(7) : header
  if (!provided) return false
  return safeCompareStrings(provided, apiKey)
}

/** Requires admin role or ADMIN_API_KEY header. */
export function requireAdmin(event: H3Event): void {
  if (checkAdminApiKey(event)) return

  const user = event.context.auth?.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (user.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
}

/** @deprecated Use requireAdmin for admin endpoints. Kept for migration period. */
export function requireAuthOrAdminApiKey(event: H3Event): void {
  if (checkAdminApiKey(event)) return
  const user = event.context.auth?.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
}
