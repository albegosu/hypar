import { prisma } from '~/server/utils/prisma'

const SKIP_PREFIXES = ['/api/auth', '/setup', '/auth/', '/api/health', '/_nuxt', '/__nuxt', '/api/setup']

export default defineEventHandler(async (event) => {
  const path = event.path

  if (SKIP_PREFIXES.some((prefix) => path.startsWith(prefix))) return

  const configured = await prisma.setting.findUnique({ where: { key: 'app.configured' } })
  if (configured) return

  const userCount = await prisma.user.count()
  if (userCount > 0) return

  if (path.startsWith('/api/')) {
    throw createError({ statusCode: 503, statusMessage: 'Setup required' })
  }

  return sendRedirect(event, '/setup')
})
