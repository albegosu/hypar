type SessionUser = {
  id: string
  name: string
  email: string
  role: string
  banned?: boolean
}

type SessionResponse = {
  user?: SessionUser | null
  session?: unknown
} | null

/**
 * Fetches the better-auth session via useAsyncData so it works correctly
 * in Nuxt component context (useSession() from better-auth/vue doesn't
 * trigger its internal fetch outside of a mounted component).
 */
export function useAuth() {
  const { data: session, pending: isPending, error } = useAsyncData<SessionResponse>(
    'auth-session',
    () => $fetch<SessionResponse>('/api/auth/get-session'),
    { server: false, default: () => null },
  )

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
