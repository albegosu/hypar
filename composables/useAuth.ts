import { useSession } from '~/utils/auth-client'

/**
 * Replaces the old useUserId (localStorage random UUID).
 * Reads the real better-auth session from the server.
 *
 * Usage:
 *   const { userId, isAdmin, isAuthenticated } = useAuth()
 */
export function useAuth() {
  const { data: session, isPending, error } = useSession()

  const user = computed(() => session.value?.user ?? null)
  const userId = computed(() => session.value?.user?.id ?? null)
  const isAdmin = computed(() => session.value?.user?.role === 'admin')
  const isAuthenticated = computed(() => !!session.value?.user)

  return {
    user,
    userId,
    isAdmin,
    isAuthenticated,
    isPending,
    error,
    session,
  }
}
