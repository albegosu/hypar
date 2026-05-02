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

const CHUNK_SIZE = 800
const OVERLAP = 100

export function splitIntoChunks(text: string): Chunk[] {
  if (!text || text.trim().length === 0) return []

  const segments = findSegments(text)
  if (segments.length === 0) return []

  const chunks: Chunk[] = []
  let chunkStartIdx = 0
  let chunkStart = segments[0].start
  let chunkEnd = segments[0].start
  let currentLength = 0

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const segLen = seg.end - seg.start

    if (currentLength + segLen > CHUNK_SIZE && currentLength > 0) {
      pushChunk(chunks, text, chunkStart, chunkEnd)

      const overlapTarget = chunkEnd - OVERLAP
      let backIdx = i
      while (
        backIdx > chunkStartIdx &&
        segments[backIdx - 1].start >= overlapTarget
      ) {
        backIdx--
      }

      chunkStartIdx = backIdx
      chunkStart = segments[chunkStartIdx].start
      chunkEnd = chunkStart
      currentLength = 0
      for (let j = chunkStartIdx; j < i; j++) {
        chunkEnd = segments[j].end
        currentLength += segments[j].end - segments[j].start
      }
    }

    chunkEnd = seg.end
    currentLength += segLen
  }

  if (chunkEnd > chunkStart) {
    pushChunk(chunks, text, chunkStart, chunkEnd)
  }

  return chunks
}

function pushChunk(chunks: Chunk[], text: string, start: number, end: number): void {
  const slice = text.slice(start, end)
  const trimmed = slice.trim()
  if (trimmed.length === 0) return
  chunks.push({
    content: trimmed,
    tokenCount: Math.ceil(trimmed.length / 4),
    startChar: start,
    endChar: end,
  })
}

function findSegments(text: string): Segment[] {
  const segments: Segment[] = []
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
