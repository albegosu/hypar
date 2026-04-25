import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChunkingService } from './chunking.service';
import { EmbeddingService } from './embedding.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import pdfParse from 'pdf-parse';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private prisma: PrismaService,
    private chunking: ChunkingService,
    private embedding: EmbeddingService,
  ) {}

  async createFromText(dto: CreateDocumentDto) {
    const title = this.sanitizePgText(dto.title);
    const content = this.sanitizePgText(dto.content);
    const metadata = this.sanitizeMetadata(dto.metadata);

    const document = await this.prisma.document.create({
      data: {
        title,
        content,
        sourceType: this.sanitizePgText(dto.sourceType),
        metadata: metadata as Prisma.InputJsonValue,
      },
    });

    await this.processDocument(document.id, content);

    return document;
  }

  async createFromFile(file: Express.Multer.File) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('No file uploaded');
    }

    const content = this.sanitizePgText(await this.extractTextFromUpload(file));
    const title = this.sanitizePgText(file.originalname || 'upload');

    const document = await this.prisma.document.create({
      data: {
        title,
        content,
        sourceType: this.detectFileType(file.mimetype),
        metadata: {
          filename: this.sanitizePgText(file.originalname ?? ''),
          size: file.size,
        },
      },
    });

    await this.processDocument(document.id, content);

    return document;
  }

  async findAll() {
    return this.prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { chunks: true } } },
    });
  }

  async findOne(id: string) {
    return this.prisma.document.findUnique({
      where: { id },
      include: { chunks: { orderBy: { index: 'asc' } } },
    });
  }

  async reprocess(documentId: string) {
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!doc) throw new NotFoundException('Document not found');

    // Delete old chunks
    await this.prisma.chunk.deleteMany({
      where: { documentId },
    });

    // Reprocess
    await this.processDocument(documentId, doc.content);

    return { message: 'Reprocessed successfully' };
  }

  async remove(documentId: string): Promise<void> {
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
      select: { id: true },
    });
    if (!doc) throw new NotFoundException('Document not found');
    // Chunks are removed via the ON DELETE CASCADE on Chunk.documentId.
    await this.prisma.document.delete({ where: { id: documentId } });
  }

  private static readonly EMBED_CONCURRENCY = 4;

  private async processDocument(documentId: string, content: string) {
    const chunks = this.chunking.split(content);
    if (chunks.length === 0) return;

    // Embed in bounded parallel batches: faster than serial without flooding Ollama.
    const concurrency = DocumentsService.EMBED_CONCURRENCY;
    const embeddings = new Array<number[]>(chunks.length);
    for (let start = 0; start < chunks.length; start += concurrency) {
      const slice = chunks.slice(start, start + concurrency);
      const batch = await Promise.all(slice.map((c) => this.embedding.generate(c.content)));
      for (let j = 0; j < batch.length; j++) {
        embeddings[start + j] = batch[j];
      }
    }

    // Persist sequentially: pgvector insert via raw query is cheap and avoids
    // serialization issues from many concurrent writers on the same table.
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embeddingString = `[${embeddings[i].join(',')}]`;
      const chunkText = this.sanitizePgText(chunk.content);
      await this.prisma.$queryRaw`
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
      `;
    }
  }

  private detectFileType(mimetype: string): string {
    if (mimetype.includes('pdf')) return 'pdf';
    if (mimetype.includes('markdown')) return 'markdown';
    if (mimetype.includes('text')) return 'text';
    return 'unknown';
  }

  /** PostgreSQL UTF8 text must not contain U+0000. */
  private sanitizePgText(s: string | Buffer | null | undefined): string {
    let str: string;
    if (Buffer.isBuffer(s)) {
      str = s.toString('utf-8');
    } else if (s == null) {
      str = '';
    } else if (typeof s === 'string') {
      str = s;
    } else {
      str = String(s);
    }
    return str.replace(/\u0000/g, '');
  }

  /** Strip NULs from string leaves of metadata for JSON/Prisma. */
  private sanitizeMetadata(meta: Record<string, unknown> | undefined): Record<string, unknown> {
    if (!meta || typeof meta !== 'object') return {};
    try {
      return JSON.parse(
        JSON.stringify(meta, (_key, value) =>
          typeof value === 'string' ? value.replace(/\u0000/g, '') : value,
        ),
      ) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  private isPdfUpload(file: Express.Multer.File): boolean {
    const mime = (file.mimetype || '').toLowerCase();
    const name = (file.originalname || '').toLowerCase();
    return mime.includes('pdf') || name.endsWith('.pdf');
  }

  private async extractTextFromUpload(file: Express.Multer.File): Promise<string> {
    if (this.isPdfUpload(file)) {
      try {
        const parsed = await pdfParse(file.buffer);
        const raw = parsed.text as string | Buffer | undefined | null;
        if (raw == null) return '';
        const text = this.sanitizePgText(raw);
        if (text.trim().length > 0) return text;
      } catch (err: any) {
        this.logger.warn(`pdf-parse failed, falling back to UTF-8 decode: ${err?.message || err}`);
      }
      return this.sanitizePgText(file.buffer);
    }

    return this.sanitizePgText(file.buffer);
  }
}
