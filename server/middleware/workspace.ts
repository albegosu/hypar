import { prisma } from '~/server/utils/prisma'

const SKIP_PATHS = ['/api/auth', '/api/setup', '/_nuxt', '/favicon']

export default defineEventHandler(async (event) => {
  if (SKIP_PATHS.some((p) => event.path.startsWith(p))) return

  const user = event.context.auth?.user
  if (!user) return

  const cookieWsId = getCookie(event, 'active-workspace')

  if (cookieWsId) {
    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: cookieWsId, userId: user.id } },
      select: { workspaceId: true },
    })
    if (member) {
      event.context.workspaceId = member.workspaceId
      return
    }
  }

  // Fall back to the user's personal workspace (first owned workspace)
  let personal = await prisma.workspace.findFirst({
    where: { ownerId: user.id },
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  })

  // Auto-create a personal workspace for brand-new users
  if (!personal) {
    const name = (user.name?.trim() || user.email?.split('@')[0] || 'user') + "'s Workspace"
    personal = await prisma.workspace.create({
      data: {
        id: crypto.randomUUID(),
        name,
        ownerId: user.id,
        members: { create: { userId: user.id, role: 'owner' } },
      },
      select: { id: true },
    })
  }

  event.context.workspaceId = personal.id
})

declare module 'h3' {
  interface H3EventContext {
    workspaceId?: string
  }
}
