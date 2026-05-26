import { prisma } from '../../../utils/prisma'
import {
  DEFAULT_ALLOWED_FORMATS,
  parseAllowedFormatsOrDefault,
} from '../../../utils/allowed-formats'
import {
  getEffectiveSettingForUpload,
  getRuntimeConfigFallback,
  getWorkspaceSettings,
} from '../../../utils/settings.service'
import { requireSessionUserId } from '../../../utils/session'
const VALID_CATEGORIES = ['chunking', 'general'] as const

async function requireWorkspaceMember(workspaceId: string, userId: string) {
  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
    select: { role: true },
  })
  if (!member) {
    throw createError({ statusCode: 403, statusMessage: 'Not a member of this workspace' })
  }
  return member
}

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const workspaceId = getRouterParam(event, 'id')!
  const member = await requireWorkspaceMember(workspaceId, userId)

  const query = getQuery(event)
  const category =
    typeof query.category === 'string' && VALID_CATEGORIES.includes(query.category as (typeof VALID_CATEGORIES)[number])
      ? query.category
      : 'chunking'

  const workspaceValues = await getWorkspaceSettings(workspaceId, category)
  const result: Record<string, string> = { ...workspaceValues }

  if (category === 'chunking') {
    const config = useRuntimeConfig()
    const fallback =
      getRuntimeConfigFallback('ALLOWED_FORMATS') ||
      String(config.allowedFormats ?? DEFAULT_ALLOWED_FORMATS)
    const effective = await getEffectiveSettingForUpload('ALLOWED_FORMATS', { workspaceId, userId }, fallback)
    result.effective_ALLOWED_FORMATS = parseAllowedFormatsOrDefault(effective).join(',')
    result.workspaceOverride = workspaceValues.ALLOWED_FORMATS ? 'true' : 'false'
  }

  return { ...result, role: member.role }
})
