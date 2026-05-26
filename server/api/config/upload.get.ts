import {
  DEFAULT_ALLOWED_FORMATS,
  formatsToAccept,
  formatsToDisplay,
  parseAllowedFormatsOrDefault,
} from '../../utils/allowed-formats'
import {
  getEffectiveSettingForUpload,
  getNumericSetting,
  getRuntimeConfigFallback,
} from '../../utils/settings.service'
import { requireSessionUserId } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const workspaceId = event.context.workspaceId
  if (!workspaceId) throw createError({ statusCode: 400, statusMessage: 'No active workspace' })

  const config = useRuntimeConfig()
  const formatsFallback =
    getRuntimeConfigFallback('ALLOWED_FORMATS') ||
    String(config.allowedFormats ?? DEFAULT_ALLOWED_FORMATS)

  const [formatsStr, maxMbStr] = await Promise.all([
    getEffectiveSettingForUpload('ALLOWED_FORMATS', { workspaceId, userId }, formatsFallback),
    getEffectiveSettingForUpload('MAX_DOC_SIZE_MB', { workspaceId, userId }, String(config.maxDocSizeMb ?? 10)),
  ])

  const allowedFormats = parseAllowedFormatsOrDefault(formatsStr)
  const maxDocSizeMb = Math.max(1, getNumericSetting(maxMbStr, 10))

  return {
    allowedFormats,
    accept: formatsToAccept(allowedFormats),
    supportsLabel: formatsToDisplay(allowedFormats),
    maxDocSizeMb,
  }
})
