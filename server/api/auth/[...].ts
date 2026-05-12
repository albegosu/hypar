import { auth } from '~/server/lib/auth'

/**
 * Catch-all handler for better-auth.
 * Handles all /api/auth/* routes: signin, signup, signout,
 * OAuth callbacks, session, etc.
 */
export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event))
})
