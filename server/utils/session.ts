import type { H3Event } from 'h3'

export function requireSessionUserId(event: H3Event): string {
  const user = event.context.auth?.user
  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return user.id
}

/** Requires an authenticated admin. Returns the admin's user id. */
export function requireAdminUserId(event: H3Event): string {
  const user = event.context.auth?.user
  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  if ((user as { role?: string }).role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  return user.id
}
