export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  try {
    const session = await $fetch<{ user?: { role?: string } }>('/api/auth/get-session')
    if (session?.user?.role === 'admin') return
  } catch {
    // fall through
  }

  return navigateTo('/')
})
