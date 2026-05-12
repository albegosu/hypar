import { Prisma } from '@prisma/client'
import pdfParse from 'pdf-parse'
import { start } from 'workflow/api'
import { prisma } from './prisma'
import { ingestDocument } from '../workflows/ingest-document'
import { createError } from 'h3'
import { notFound, badRequest } from './errors'
import { stripNul, sanitizeJsonMetadata, safeFilename } from './text'

export interface UploadedFile {
  buffer: Buffer
  originalname: string
  mimetype: string
  size: number
}

export interface CreateDocumentInput {
  title: string
  content: string
  sourceType: string
  userId?: string
  metadata?: Record<string, unknown>
}

const ALLOWED_MIME = new Set([
  'application/pdf',
  'text/plain',
  'text/markdown',
  'text/x-markdown',
  'application/octet-stream', // browsers sometimes send this for .md/.txt
])

export function isAllowedMime(mime: string, filename: string): boolean {
  if (ALLOWED_MIME.has(mime.toLowerCase())) return true
  const lower = filename.toLowerCase()
  return lower.endsWith('.pdf') || lower.endsWith('.txt') || lower.endsWith('.md')
}

function detectFileType(mimetype: string, filename: string): string {
  const m = (mimetype || '').toLowerCase()
  const f = (filename || '').toLowerCase()
  if (m.includes('pdf') || f.endsWith('.pdf')) return 'pdf'
  if (m.includes('markdown') || f.endsWith('.md')) return 'markdown'
  if (m.includes('text') || f.endsWith('.txt')) return 'text'
  return 'unknown'
}

async function extractTextFromUpload(file: UploadedFile): Promise<string> {
  const mime = (file.mimetype || '').toLowerCase()
  const name = (file.originalname || '').toLowerCase()
  const isPdf = mime.includes('pdf') || name.endsWith('.pdf')

  if (isPdf) {
    try {
      const parsed = await pdfParse(file.buffer)
      const raw = parsed.text as string | Buffer | undefined | null
      if (raw != null) {
        const text = stripNul(raw)
        if (text.trim().length > 0) return text
      }
    } catch {
      /* fall through to buffer decode */
    }
    return stripNul(file.buffer)
  }

  return stripNul(file.buffer)
}

/**
 * Create a Document row in 'pending' state and trigger the async ingestion workflow.
 * Returns the document id and the workflow runId so the caller can poll status.
 */
export async function ingestFromText(input: CreateDocumentInput): Promise<{
  documentId: string
  title: string
  runId: string
  status: 'processing'
}> {
  const title = stripNul(input.title).trim() || 'untitled'
  const content = stripNul(input.content)
  if (!content.trim()) throw badRequest('Empty content')

  const document = await prisma.document.create({
    data: {
      title,
      content,
      sourceType: stripNul(input.sourceType) || 'text',
      metadata: sanitizeJsonMetadata(input.metadata) as Prisma.InputJsonValue,
      userId: input.userId?.trim() || 'legacy',
      ingestStatus: 'processing',
    },
  })

  const run = await start(ingestDocument, [document.id, content])
  return { documentId: document.id, title: document.title, runId: run.runId, status: 'processing' }
}

/**
 * Same as ingestFromText but for an uploaded file. Extracts text first.
 */
export async function ingestFromFile(
  file: UploadedFile,
  opts: { userId?: string } = {},
): Promise<{ documentId: string; title: string; runId: string; status: 'processing' }> {
  if (!file?.buffer?.length) throw badRequest('No file uploaded')
  if (!isAllowedMime(file.mimetype, file.originalname)) {
    throw badRequest(`Unsupported file type: ${file.mimetype || 'unknown'}`)
  }

  const content = await extractTextFromUpload(file)
  if (!content.trim()) throw badRequest('Could not extract any text from the file')

  const title = safeFilename(file.originalname)

  const document = await prisma.document.create({
    data: {
      title,
      content,
      sourceType: detectFileType(file.mimetype, file.originalname),
      metadata: sanitizeJsonMetadata({
        filename: safeFilename(file.originalname),
        size: file.size,
        mime: file.mimetype,
      }) as Prisma.InputJsonValue,
      userId: opts.userId?.trim() || 'legacy',
      ingestStatus: 'processing',
    },
  })

  const run = await start(ingestDocument, [document.id, content])
  return { documentId: document.id, title: document.title, runId: run.runId, status: 'processing' }
}

export async function createChatMemory(userId: string | undefined, content: string) {
  const text = stripNul(content).trim()
  if (!text) return null
  const title = text.length > 80 ? text.slice(0, 80).trim() : text
  return ingestFromText({
    title: title || 'chat memory',
    content: text,
    sourceType: 'text',
    userId,
    metadata: { kind: 'chat_memory' },
  })
}

export async function deleteChatMemories(userId: string | undefined, term?: string) {
  const trimmedTerm = term?.trim()
  const conditions: Prisma.Sql[] = []

  if (userId?.trim()) {
    conditions.push(Prisma.sql`"userId" = ${userId.trim()}`)
  } else {
    conditions.push(Prisma.sql`"userId" IS NULL`)
  }

  conditions.push(Prisma.sql`metadata->>'kind' = 'chat_memory'`)

  if (trimmedTerm) {
    conditions.push(Prisma.sql`content ILIKE ${`%${trimmedTerm}%`}`)
  }

  const where = Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
  return prisma.$executeRaw(Prisma.sql`DELETE FROM "Document" ${where}`)
}

export async function listChatMemories(userId: string | undefined): Promise<string[]> {
  const userCondition = userId?.trim()
    ? Prisma.sql`"userId" = ${userId.trim()}`
    : Prisma.sql`"userId" IS NULL`

  const rows = await prisma.$queryRaw<Array<{ content: string }>>(Prisma.sql`
    SELECT content
    FROM "Document"
    WHERE ${userCondition}
      AND metadata->>'kind' = 'chat_memory'
    ORDER BY "createdAt" DESC
    LIMIT 20
  `)

  return rows.map((r) => r.content)
}

export async function chatMemoryExists(
  userId: string | undefined,
  contentSnippet: string,
): Promise<boolean> {
  const snippet = stripNul(contentSnippet).trim()
  if (!snippet) return false

  const userCondition = userId?.trim()
    ? Prisma.sql`"userId" = ${userId.trim()}`
    : Prisma.sql`"userId" IS NULL`

  const rows = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
    SELECT id
    FROM "Document"
    WHERE ${userCondition}
      AND metadata->>'kind' = 'chat_memory'
      AND content ILIKE ${`%${snippet}%`}
    LIMIT 1
  `)

  return rows.length > 0
}

export async function findAll(userId?: string) {
  const where = userId?.trim() ? { userId: userId.trim() } : { userId: 'legacy' }
  return prisma.document.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { chunks: true } } },
  })
}

export async function findOne(id: string) {
  const doc = await prisma.document.findUnique({
    where: { id },
    include: { chunks: { orderBy: { index: 'asc' } } },
  })
  if (!doc) throw notFound('Document not found')
  return doc
}

export async function reprocessDocument(documentId: string): Promise<{ runId: string }> {
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, content: true },
  })
  if (!doc) throw notFound('Document not found')

  await prisma.chunk.deleteMany({ where: { documentId } })
  await prisma.document.update({
    where: { id: documentId },
    data: { ingestStatus: 'processing', ingestError: null, chunkCount: 0 },
  })

  const run = await start(ingestDocument, [documentId, doc.content])
  return { runId: run.runId }
}

export async function removeDocument(documentId: string, userId?: string): Promise<void> {
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, userId: true },
  })
  if (!doc) throw notFound('Document not found')
  if (doc.userId && userId?.trim() && doc.userId !== userId.trim()) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  await prisma.document.delete({ where: { id: documentId } })
}
