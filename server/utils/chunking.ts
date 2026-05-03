import { getEncoding, type Tiktoken } from 'js-tiktoken'

export interface Chunk {
  content: string
  tokenCount: number
  startChar: number
  endChar: number
}

interface Segment {
  start: number
  end: number
}

const DEFAULT_CHUNK_TOKENS = 400
const DEFAULT_OVERLAP_TOKENS = 60

let encoder: Tiktoken | null = null
function getEncoder(): Tiktoken {
  if (!encoder) encoder = getEncoding('cl100k_base')
  return encoder
}

export function countTokens(text: string): number {
  if (!text) return 0
  return getEncoder().encode(text).length
}

export interface ChunkOptions {
  chunkTokens?: number
  overlapTokens?: number
}

export function splitIntoChunks(text: string, opts: ChunkOptions = {}): Chunk[] {
  const chunkTokens = opts.chunkTokens ?? DEFAULT_CHUNK_TOKENS
  const overlapTokens = opts.overlapTokens ?? DEFAULT_OVERLAP_TOKENS
  if (overlapTokens >= chunkTokens) {
    throw new Error(`overlapTokens (${overlapTokens}) must be < chunkTokens (${chunkTokens})`)
  }
  if (!text || text.trim().length === 0) return []

  const segments = findSegments(text)
  if (segments.length === 0) return []

  const chunks: Chunk[] = []
  let chunkStartIdx = 0
  let chunkStart = segments[0].start
  let chunkEnd = segments[0].end
  let segmentTokens: number[] = []
  let currentTokens = 0

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const segText = text.slice(seg.start, seg.end)
    const segTok = countTokens(segText)
    segmentTokens[i] = segTok

    if (currentTokens + segTok > chunkTokens && currentTokens > 0) {
      pushChunk(chunks, text, chunkStart, chunkEnd, currentTokens)

      // Walk back from the new segment until we have ~overlapTokens of overlap.
      let backIdx = i
      let backTokens = 0
      while (backIdx > chunkStartIdx && backTokens + segmentTokens[backIdx - 1] <= overlapTokens) {
        backIdx--
        backTokens += segmentTokens[backIdx]
      }

      chunkStartIdx = backIdx
      chunkStart = segments[chunkStartIdx].start
      chunkEnd = chunkStart
      currentTokens = 0
      for (let j = chunkStartIdx; j < i; j++) {
        chunkEnd = segments[j].end
        currentTokens += segmentTokens[j]
      }
    }

    chunkEnd = seg.end
    currentTokens += segTok
  }

  if (chunkEnd > chunkStart) {
    pushChunk(chunks, text, chunkStart, chunkEnd, currentTokens)
  }

  return chunks
}

function pushChunk(
  chunks: Chunk[],
  text: string,
  start: number,
  end: number,
  tokenCount: number,
): void {
  const slice = text.slice(start, end)
  const trimmed = slice.trim()
  if (trimmed.length === 0) return
  chunks.push({
    content: trimmed,
    tokenCount,
    startChar: start,
    endChar: end,
  })
}

function findSegments(text: string): Segment[] {
  const segments: Segment[] = []
  // Split on paragraph breaks → sentence boundaries → newlines → whitespace.
  const splitRegex = /(\n\n+|(?<=[.!?])\s+|\n|(?<=\S)\s)/g
  let cursor = 0
  let match: RegExpExecArray | null
  while ((match = splitRegex.exec(text)) !== null) {
    const end = match.index + match[0].length
    if (end > cursor) {
      segments.push({ start: cursor, end })
      cursor = end
    }
  }
  if (cursor < text.length) {
    segments.push({ start: cursor, end: text.length })
  }
  return segments
}
