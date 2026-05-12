import { Prisma } from '@prisma/client'
import { registerStepFunction } from 'workflow/internal/private'
import type { Chunk } from '../utils/chunking'
import { splitIntoChunks, getChunkConfig } from '../utils/chunking'
import { generateEmbeddings, invalidateEmbeddingCache } from '../utils/embedding'
import { prisma } from '../utils/prisma'
import { stripNul } from '../utils/text'

// Step IDs must match the generated steps.mjs from @workflow/nitro
const NS = 'step//./server/workflows/ingest-document'

export default defineNitroPlugin(() => {
  registerStepFunction(`${NS}//parseChunks`, async (content: string): Promise<Chunk[]> => {
    return splitIntoChunks(content, await getChunkConfig())
  })

  registerStepFunction(
    `${NS}//embedChunksWithRetry`,
    async (texts: string[]): Promise<number[][]> => {
      // Invalidate any cached embeddings so a re-ingest always uses fresh vectors.
      await invalidateEmbeddingCache(texts)

      const MAX_ATTEMPTS = 3
      const BASE_DELAY_MS = 500
      let lastErr: unknown
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          return await generateEmbeddings(texts)
        } catch (err) {
          lastErr = err
          if (attempt === MAX_ATTEMPTS) break
          await new Promise((r) => setTimeout(r, BASE_DELAY_MS * Math.pow(2, attempt - 1)))
        }
      }
      throw lastErr instanceof Error ? lastErr : new Error(String(lastErr))
    },
  )

  registerStepFunction(
    `${NS}//persistChunks`,
    async (documentId: string, chunks: Chunk[], embeddings: number[][]): Promise<void> => {
      if (chunks.length !== embeddings.length) {
        throw new Error(
          `Embedding count mismatch: ${chunks.length} chunks vs ${embeddings.length} embeddings`,
        )
      }
      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw(Prisma.sql`DELETE FROM "Chunk" WHERE "documentId" = ${documentId}`)
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i]
          const embeddingString = `[${embeddings[i].join(',')}]`
          const chunkText = stripNul(chunk.content)
          await tx.$executeRaw(Prisma.sql`
            INSERT INTO "Chunk" (
              id, "documentId", content, embedding, index, "tokenCount", "startChar", "endChar", "createdAt"
            ) VALUES (
              gen_random_uuid(),
              ${documentId},
              ${chunkText},
              ${embeddingString}::vector,
              ${i},
              ${chunk.tokenCount},
              ${chunk.startChar},
              ${chunk.endChar},
              NOW()
            )
          `)
        }
      })
    },
  )

  registerStepFunction(
    `${NS}//markStatus`,
    async (
      documentId: string,
      status: 'ready' | 'failed',
      chunkCount: number,
      error: string | null,
    ): Promise<void> => {
      try {
        await prisma.document.update({
          where: { id: documentId },
          data: { ingestStatus: status, chunkCount, ingestError: error },
        })
      } catch {
        // Document may have been deleted while ingesting; not fatal.
      }
    },
  )
})
