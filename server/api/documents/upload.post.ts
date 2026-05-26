import { ingestFromFile } from '../../utils/documents.service'
import {
  DEFAULT_ALLOWED_FORMATS,
  parseAllowedFormatsOrDefault,
} from '../../utils/allowed-formats'
import {
  getEffectiveSettingForUpload,
  getNumericSetting,
  getRuntimeConfigFallback,
} from '../../utils/settings.service'
import { requireSessionUserId } from '../../utils/session'

async function getUploadConfig(workspaceId: string, userId: string) {
  const config = useRuntimeConfig()
  const fallback =
    getRuntimeConfigFallback('ALLOWED_FORMATS') ||
    String(config.allowedFormats ?? DEFAULT_ALLOWED_FORMATS)

  const [maxMbStr, formatsStr] = await Promise.all([
    getEffectiveSettingForUpload('MAX_DOC_SIZE_MB', { workspaceId, userId }, String(config.maxDocSizeMb ?? 10)),
    getEffectiveSettingForUpload('ALLOWED_FORMATS', { workspaceId, userId }, fallback),
  ])
  const maxMb = Math.max(1, getNumericSetting(maxMbStr, 10))
  const formats = parseAllowedFormatsOrDefault(formatsStr)
  return { maxBytes: maxMb * 1024 * 1024, formats }
}

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const workspaceId = event.context.workspaceId
  if (!workspaceId) throw createError({ statusCode: 400, statusMessage: 'No active workspace' })

  const parts = await readMultipartFormData(event)
  if (!parts?.length) throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })

  const filePart = parts.find((p) => p.name === 'file')
  if (!filePart?.data?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No file part named "file"' })
  }

  const { maxBytes, formats } = await getUploadConfig(workspaceId, userId)

  if (filePart.data.length > maxBytes) {
    const mb = Math.round(maxBytes / 1024 / 1024)
    throw createError({ statusCode: 413, statusMessage: `File exceeds ${mb} MB limit` })
  }

  const filename = filePart.filename ?? 'upload'
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  if (formats.length > 0 && ext && !formats.includes(ext)) {
    throw createError({
      statusCode: 415,
      statusMessage: `File type .${ext} not allowed. Allowed: ${formats.join(', ')}`,
    })
  }

  return ingestFromFile(
    {
      buffer: filePart.data,
      originalname: filename,
      mimetype: filePart.type ?? 'application/octet-stream',
      size: filePart.data.length,
    },
    { workspaceId, allowedFormats: formats },
  )
})
