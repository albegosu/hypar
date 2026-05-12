import { prisma } from './prisma'

/** True only before first admin exists and `app.configured` is unset. */
export async function isPreInitialSetup(): Promise<boolean> {
  const configured = await prisma.setting.findUnique({ where: { key: 'app.configured' } })
  if (configured) return false
  const userCount = await prisma.user.count()
  return userCount === 0
}

export async function requirePreInitialSetup(): Promise<void> {
  if (!(await isPreInitialSetup())) {
    throw createError({ statusCode: 409, statusMessage: 'Already configured' })
  }
}
