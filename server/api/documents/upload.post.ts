import { ingestFromFile } from '../../utils/documents.service'
import { getSetting, getNumericSetting } from '../../utils/settings.service'

async function getUploadConfig() {
  const config = useRuntimeConfig()
  const [maxMbStr, formatsStr] = await Promise.all([
    getSetting('MAX_DOC_SIZE_MB', String(config.maxDocSizeMb ?? 10)),
    getSetting('ALLOWED_FORMATS', String(config.allowedFormats ?? 'pdf,md,txt')),
  ])
  const maxMb = Math.max(1, getNumericSetting(maxMbStr, 10))
  const formats = formatsStr
    .split(',')
    .map((f) => f.trim().toLowerCase().replace(/^\./, ''))
    .filter(Boolean)
  return { maxBytes: maxMb * 1024 * 1024, formats }
}

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)
  if (!parts?.length) throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })

  const filePart = parts.find((p) => p.name === 'file')
  if (!filePart?.data?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No file part named "file"' })
  }

  const { maxBytes, formats } = await getUploadConfig()

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

  requireSessionUserId(event)
  const workspaceId = event.context.workspaceId
  if (!workspaceId) throw createError({ statusCode: 400, statusMessage: 'No active workspace' })

  return ingestFromFile(
    {
      buffer: filePart.data,
      originalname: filename,
      mimetype: filePart.type ?? 'application/octet-stream',
      size: filePart.data.length,
    },
    { workspaceId },
  )
})
