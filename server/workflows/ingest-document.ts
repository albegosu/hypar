import { Prisma } from '@prisma/client'
import { prisma } from '../utils/prisma'
import { splitIntoChunks, getChunkConfig, type Chunk } from '../utils/chunking'
import { generateEmbeddings, invalidateEmbeddingCache } from '../utils/embedding'
import { stripNul } from '../utils/text'

export interface IngestResult {
  documentId: string
  chunkCount: number
  status: 'ready' | 'failed'
  error?: string
}

export async function ingestDocument(documentId: string, content: string): Promise<IngestResult> {
  'use workflow'

  try {
    const chunks = await parseChunks(content)
    if (!chunks.length) {
      await markStatus(documentId, 'ready', 0, null)
      return { documentId, chunkCount: 0, status: 'ready' }
    }

    const chunkTexts = chunks.map((c) => c.content)
    // Drop any cached embeddings for these chunks so a re-ingest (after a
    // chunking-strategy or content change) doesn't reuse stale vectors.
    invalidateEmbeddingCache(chunkTexts)
    const embeddings = await embedChunksWithRetry(chunkTexts)
    await persistChunks(documentId, chunks, embeddings)
    await markStatus(documentId, 'ready', chunks.length, null)

    return { documentId, chunkCount: chunks.length, status: 'ready' }
  } catch (err) {
    const message = (err as Error)?.message ?? String(err)
    await markStatus(documentId, 'failed', 0, message)
    return { documentId, chunkCount: 0, status: 'failed', error: message }
  }
}

export async function parseChunks(content: string): Promise<Chunk[]> {
  'use step'
  return splitIntoChunks(content, await getChunkConfig())
}

export async function embedChunksWithRetry(texts: string[]): Promise<number[][]> {
  'use step'

  const MAX_ATTEMPTS = 3
  const BASE_DELAY_MS = 500

  let lastErr: unknown
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await generateEmbeddings(texts)
    } catch (err) {
      lastErr = err
      if (attempt === MAX_ATTEMPTS) break
      const wait = BASE_DELAY_MS * Math.pow(2, attempt - 1)
      await new Promise((r) => setTimeout(r, wait))
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr))
}

export async function persistChunks(
  documentId: string,
  chunks: Chunk[],
  embeddings: number[][],
): Promise<void> {
  'use step'

  if (chunks.length !== embeddings.length) {
    throw new Error(
      `Embedding count mismatch: ${chunks.length} chunks vs ${embeddings.length} embeddings`,
    )
  }

  await prisma.$transaction(async (tx) => {
    // Wipe any pre-existing chunks for this document so reingest is idempotent.
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
}

export async function markStatus(
  documentId: string,
  status: 'ready' | 'failed',
  chunkCount: number,
  error: string | null,
): Promise<void> {
  'use step'

  try {
    await prisma.document.update({
      where: { id: documentId },
      data: { ingestStatus: status, chunkCount, ingestError: error },
    })
  } catch {
    // Document may have been deleted while we were ingesting; not fatal.
  }
}
