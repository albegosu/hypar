import { getEncoding, type Tiktoken } from 'js-tiktoken'
import { getSetting, getNumericSetting } from './settings.service'

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
const DEFAULT_STRATEGY = 'sentence-aware'

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
  strategy?: 'sentence-aware' | 'fixed' | 'with-overlap'
}

export async function getChunkConfig(): Promise<ChunkOptions> {
  const config = useRuntimeConfig()
  const [chunkSizeStr, chunkOverlapStr, strategyStr] = await Promise.all([
    getSetting('CHUNK_SIZE', String(config.chunkSize ?? DEFAULT_CHUNK_TOKENS)),
    getSetting('CHUNK_OVERLAP', String(config.chunkOverlap ?? DEFAULT_OVERLAP_TOKENS)),
    getSetting('CHUNK_STRATEGY', String(config.chunkStrategy ?? DEFAULT_STRATEGY)),
  ])
  const chunkTokens = Math.max(1, getNumericSetting(chunkSizeStr, DEFAULT_CHUNK_TOKENS))
  const overlapTokens = Math.max(0, getNumericSetting(chunkOverlapStr, DEFAULT_OVERLAP_TOKENS))
  const strategy = (['sentence-aware', 'fixed', 'with-overlap'] as const).includes(strategyStr as never)
    ? (strategyStr as ChunkOptions['strategy'])
    : DEFAULT_STRATEGY
  return { chunkTokens, overlapTokens, strategy }
}

export function splitIntoChunks(text: string, opts: ChunkOptions = {}): Chunk[] {
  const chunkTokens = opts.chunkTokens ?? DEFAULT_CHUNK_TOKENS
  const overlapTokens = opts.overlapTokens ?? DEFAULT_OVERLAP_TOKENS
  const strategy = opts.strategy ?? DEFAULT_STRATEGY

  if (!text || text.trim().length === 0) return []

  if (strategy === 'fixed') {
    return splitFixed(text, chunkTokens)
  }

  // sentence-aware: no overlap; with-overlap: sentence-aware + overlap
  const effectiveOverlap = strategy === 'with-overlap' ? overlapTokens : 0

  if (effectiveOverlap >= chunkTokens) {
    throw new Error(`overlapTokens (${effectiveOverlap}) must be < chunkTokens (${chunkTokens})`)
  }

  const segments = findSegments(text)
  if (segments.length === 0) return []

  const chunks: Chunk[] = []
  let chunkStartIdx = 0
  let chunkStart = segments[0].start
  let chunkEnd = segments[0].end
  const segmentTokens: number[] = []
  let currentTokens = 0

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const segText = text.slice(seg.start, seg.end)
    const segTok = countTokens(segText)
    segmentTokens[i] = segTok

    if (currentTokens + segTok > chunkTokens && currentTokens > 0) {
      pushChunk(chunks, text, chunkStart, chunkEnd, currentTokens)

      // Walk back from the new segment to gather ~effectiveOverlap tokens of context
      let backIdx = i
      let backTokens = 0
      while (backIdx > chunkStartIdx && backTokens + segmentTokens[backIdx - 1] <= effectiveOverlap) {
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

// ─── fixed strategy ──────────────────────────────────────────────────────────

function splitFixed(text: string, chunkTokens: number): Chunk[] {
  const enc = getEncoder()
  const tokens = enc.encode(text)
  const chunks: Chunk[] = []

  for (let start = 0; start < tokens.length; start += chunkTokens) {
    const slice = tokens.slice(start, start + chunkTokens)
    // Re-decode to get the original text slice
    const content = new TextDecoder().decode(enc.decode(slice)).trim()
    if (!content) continue
    // Approximate char offsets (not exact, but good enough for citations)
    const charStart = Math.round((start / tokens.length) * text.length)
    const charEnd = Math.round(((start + slice.length) / tokens.length) * text.length)
    chunks.push({ content, tokenCount: slice.length, startChar: charStart, endChar: charEnd })
  }

  return chunks
}

// ─── helpers ─────────────────────────────────────────────────────────────────

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
