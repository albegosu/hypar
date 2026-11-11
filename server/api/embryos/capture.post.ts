import { z } from 'zod'
import { generateText } from 'ai'
import { requireSessionUserId } from '~/server/utils/session'
import { resolveChatModel } from '~/server/utils/llm-provider'
import { fetchCapturePage, CaptureFetchError, type CapturedPage } from '~/server/utils/capture-fetch'
import { prisma } from '~/server/utils/prisma'
import { logger } from '~/server/utils/logger'
import { classifyLlmError } from '~/utils/llm-errors'
import { providerSupportsVision, type LlmProviderId } from '~/utils/llm-providers'
import {
  CAPTURE_MAX_IMAGE_BYTES,
  CAPTURE_SYSTEM_PROMPT,
  buildCapturePrompt,
  parseCaptureUrl,
  parseImageDataUrl,
  parseRootIdea,
} from '~/utils/capture'

const bodySchema = z.object({
  url: z.string().trim().max(2000).optional(),
  /** `data:image/...;base64,...`; needs a vision-capable model. */
  image: z.string().max(Math.ceil(CAPTURE_MAX_IMAGE_BYTES * 4 / 3) + 100).optional(),
  note: z.string().trim().max(500).optional(),
}).refine(b => b.url || b.image, { message: 'Send a link or an image' })

/**
 * Capture → seed (docs/direction.md): reads a link or an image and proposes ONE candidate root idea.
 * It creates nothing; the user confirms or edits the candidate, and only then plants it through the
 * normal create path. The seed stays the user's own sentence; the link is stored beside it.
 */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const body = await readValidatedBody(event, bodySchema.parse)

  const image = body.image ? parseImageDataUrl(body.image) : null
  if (body.image && (!image || image.bytes > CAPTURE_MAX_IMAGE_BYTES)) {
    throw createError({ statusCode: 400, statusMessage: 'Attach a PNG, JPEG, WebP or GIF under 4 MB.' })
  }
  if (body.url && !parseCaptureUrl(body.url)) {
    throw createError({ statusCode: 400, statusMessage: 'Paste a public http(s) link.' })
  }

  if (image) {
    const connection = await prisma.providerConnection.findUnique({ where: { userId }, select: { provider: true } })
    if (!connection || !providerSupportsVision(connection.provider as LlmProviderId)) {
      throw createError({ statusCode: 409, statusMessage: 'Reading images needs your own Anthropic or OpenAI key (Settings).' })
    }
  }

  let page: CapturedPage | null = null
  if (body.url) {
    try {
      page = await fetchCapturePage(body.url)
    }
    catch (err) {
      if (err instanceof CaptureFetchError) throw createError({ statusCode: err.statusCode, statusMessage: err.message })
      throw err
    }
  }

  const resolved = await resolveChatModel(userId)
  const prompt = buildCapturePrompt({ url: page?.url, title: page?.title, text: page?.text, note: body.note })

  try {
    const result = await generateText({
      model: resolved.model,
      system: CAPTURE_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: image
          ? [{ type: 'text', text: prompt }, { type: 'image', image: image.base64, mediaType: image.mediaType }]
          : [{ type: 'text', text: prompt }],
      }],
      maxOutputTokens: resolved.maxOutputTokens ?? 1_000,
      abortSignal: AbortSignal.timeout(resolved.timeoutMs),
    })
    const idea = parseRootIdea(result.text)
    if (!idea) {
      throw createError({ statusCode: 422, statusMessage: 'No clear idea in that capture. Write the seed yourself.' })
    }
    return { idea, sourceUrl: page?.url ?? null, sourceTitle: page?.title ?? null, provider: resolved.label }
  }
  catch (err) {
    if ((err as { statusCode?: number })?.statusCode === 422) throw err
    const classified = classifyLlmError(err)
    logger.error('capture failed', { kind: classified.kind, statusCode: classified.statusCode })
    throw createError({ statusCode: classified.statusCode, statusMessage: classified.rawMessage.slice(0, 280) || 'Capture failed' })
  }
})
