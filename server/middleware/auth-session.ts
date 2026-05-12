import { auth } from '~/server/lib/auth'

/**
 * Attaches the better-auth session to every H3 event context.
 * Downstream handlers read: event.context.auth?.user
 *
 * Skips the auth routes themselves to avoid circular overhead.
 */
export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/auth')) return

  const session = await auth.api.getSession({
    headers: event.headers,
  })

  event.context.auth = session ?? null
})

// Extend H3 event context type
declare module 'h3' {
  interface H3EventContext {
    auth: Awaited<ReturnType<typeof auth.api.getSession>> | null
  }
}
