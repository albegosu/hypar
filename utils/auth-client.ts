import { createAuthClient } from 'better-auth/vue'
import { adminClient } from 'better-auth/client/plugins'

/**
 * better-auth browser client.
 * Use the named exports in components and composables.
 */
export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  plugins: [adminClient()],
})

export const { signIn, signUp, signOut, useSession } = authClient
