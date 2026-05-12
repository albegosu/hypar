import type { Chunk } from '../utils/chunking'

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
    // Cache invalidation happens inside embedChunksWithRetry (see register-workflow-steps.ts)
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
  throw new Error('Step not registered')
}

export async function embedChunksWithRetry(texts: string[]): Promise<number[][]> {
  'use step'
  throw new Error('Step not registered')
}

export async function persistChunks(
  documentId: string,
  chunks: Chunk[],
  embeddings: number[][],
): Promise<void> {
  'use step'
  throw new Error('Step not registered')
}

export async function markStatus(
  documentId: string,
  status: 'ready' | 'failed',
  chunkCount: number,
  error: string | null,
): Promise<void> {
  'use step'
  throw new Error('Step not registered')
}
