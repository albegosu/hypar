import type { H3Event } from 'h3'

export function requireSessionUserId(event: H3Event): string {
  const user = event.context.auth?.user
  if (!user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  return user.id
}
