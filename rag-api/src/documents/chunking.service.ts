import { Injectable } from '@nestjs/common';

export interface Chunk {
  content: string;
  tokenCount: number;
  startChar: number;
  endChar: number;
}

interface Segment {
  start: number;
  end: number;
}

@Injectable()
export class ChunkingService {
  private readonly CHUNK_SIZE = 800;
  private readonly OVERLAP = 100;

  /**
   * Splits a document into chunks suitable for embedding.
   *
   * Each returned chunk carries `startChar`/`endChar` offsets into the ORIGINAL
   * text so the UI can highlight the source passage. The previous implementation
   * mutated the text via regex replace before splitting, which silently shifted
   * those offsets — citations could end up pointing at the wrong characters.
   */
  split(text: string): Chunk[] {
    if (!text || text.trim().length === 0) return [];

    const segments = this.findSegments(text);
    if (segments.length === 0) return [];

    const chunks: Chunk[] = [];
    let chunkStartIdx = 0;
    let chunkStart = segments[0].start;
    let chunkEnd = segments[0].start;
    let currentLength = 0;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const segLen = seg.end - seg.start;

      if (currentLength + segLen > this.CHUNK_SIZE && currentLength > 0) {
        this.pushChunk(chunks, text, chunkStart, chunkEnd);

        const overlapTarget = chunkEnd - this.OVERLAP;
        let backIdx = i;
        while (backIdx > chunkStartIdx && segments[backIdx - 1].start >= overlapTarget) {
          backIdx--;
        }

        chunkStartIdx = backIdx;
        chunkStart = segments[chunkStartIdx].start;
        chunkEnd = chunkStart;
        currentLength = 0;
        for (let j = chunkStartIdx; j < i; j++) {
          chunkEnd = segments[j].end;
          currentLength += segments[j].end - segments[j].start;
        }
      }

      chunkEnd = seg.end;
      currentLength += segLen;
    }

    if (chunkEnd > chunkStart) {
      this.pushChunk(chunks, text, chunkStart, chunkEnd);
    }

    return chunks;
  }

  private pushChunk(chunks: Chunk[], text: string, start: number, end: number): void {
    const slice = text.slice(start, end);
    const trimmed = slice.trim();
    if (trimmed.length === 0) return;
    chunks.push({
      content: trimmed,
      tokenCount: this.estimateTokens(trimmed),
      startChar: start,
      endChar: end,
    });
  }

  /**
   * Splits text into segments at natural boundaries — paragraphs, line breaks,
   * sentence ends, then word breaks — keeping the separator inside each segment
   * so that concatenating segments reproduces the original text exactly.
   */
  private findSegments(text: string): Segment[] {
    const segments: Segment[] = [];
    const splitRegex = /(\n\n+|(?<=[.!?])\s+|\n|(?<=\S)\s)/g;
    let cursor = 0;
    let match: RegExpExecArray | null;
    while ((match = splitRegex.exec(text)) !== null) {
      const end = match.index + match[0].length;
      if (end > cursor) {
        segments.push({ start: cursor, end });
        cursor = end;
      }
    }
    if (cursor < text.length) {
      segments.push({ start: cursor, end: text.length });
    }
    return segments;
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
