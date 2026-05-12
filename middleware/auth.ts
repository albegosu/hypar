import { until } from '@vueuse/core'

const PUBLIC_ROUTES = ['/setup', '/auth/signin', '/auth/signup']

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, isPending } = useAuth()

  // Wait for the session to resolve before deciding — avoids false pass-through
  if (isPending.value) {
    await until(isPending).toBe(false)
  }

  if (!isAuthenticated.value && !PUBLIC_ROUTES.includes(to.path)) {
    return navigateTo('/auth/signin')
  }
})
