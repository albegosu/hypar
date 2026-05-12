export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:error', (error: unknown) => {
    const status = (error as { statusCode?: number })?.statusCode
    if (status === 401) navigateTo('/auth/signin')
  })
})
