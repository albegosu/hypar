import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireIntegration } from '~/server/utils/integration-auth'
import { MAX_REFERENCE_INDEX_CHARS, countReferenceTopics } from '~/utils/reference-index'

const bodySchema = z.object({
  markdown: z.string().trim().min(1).max(MAX_REFERENCE_INDEX_CHARS),
  commit: z.string().trim().max(80).optional(),
})

/**
 * Replaces the user's snapshot of their second-brain index. Only the index
 * travels: topic and item names and summaries, never source notes.
 * See docs/experiments/saved-references-as-contrast.md (Phase 1).
 */
export default defineEventHandler(async (event) => {
  const { userId } = await requireIntegration(event)
  const { markdown, commit } = await readValidatedBody(event, bodySchema.parse)

  const row = await prisma.referenceIndex.upsert({
    where: { userId },
    create: { userId, markdown, commit: commit || null },
    update: { markdown, commit: commit || null },
    select: { updatedAt: true, commit: true },
  })

  return { ...row, topics: countReferenceTopics(markdown), chars: markdown.length }
})
