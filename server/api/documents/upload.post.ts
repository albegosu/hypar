import { ingestFromFile } from '../../utils/documents.service'

const TEN_MB = 10 * 1024 * 1024

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)
  if (!parts?.length) throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })

  const filePart = parts.find((p) => p.name === 'file')
  if (!filePart?.data?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No file part named "file"' })
  }

  if (filePart.data.length > TEN_MB) {
    throw createError({ statusCode: 413, statusMessage: 'File exceeds 10 MB limit' })
  }

  const userIdPart = parts.find((p) => p.name === 'userId')
  const userId = userIdPart?.data?.toString('utf-8').trim() || undefined

  return ingestFromFile(
    {
      buffer: filePart.data,
      originalname: filePart.filename ?? 'upload',
      mimetype: filePart.type ?? 'application/octet-stream',
      size: filePart.data.length,
    },
    { userId },
  )
})
