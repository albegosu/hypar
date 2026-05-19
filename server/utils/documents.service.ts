import { Prisma } from '@prisma/client'
import pdfParse from 'pdf-parse'
import * as XLSX from 'xlsx'
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
  workspaceId: string
  metadata?: Record<string, unknown>
}

const ALLOWED_MIME = new Set([
  'application/pdf',
  'text/plain',
  'text/markdown',
  'text/x-markdown',
  'application/octet-stream', // browsers sometimes send this for .md/.txt
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
])

function isSpreadsheet(mime: string, filename: string): boolean {
  const m = mime.toLowerCase()
  const f = filename.toLowerCase()
  return (
    m === 'application/vnd.ms-excel' ||
    m === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    f.endsWith('.xls') ||
    f.endsWith('.xlsx')
  )
}

export function isAllowedMime(mime: string, filename: string): boolean {
  if (ALLOWED_MIME.has(mime.toLowerCase())) return true
  const lower = filename.toLowerCase()
  return (
    lower.endsWith('.pdf') ||
    lower.endsWith('.txt') ||
    lower.endsWith('.md') ||
    lower.endsWith('.xls') ||
    lower.endsWith('.xlsx')
  )
}

function detectFileType(mimetype: string, filename: string): string {
  const m = (mimetype || '').toLowerCase()
  const f = (filename || '').toLowerCase()
  if (m.includes('pdf') || f.endsWith('.pdf')) return 'pdf'
  if (m.includes('markdown') || f.endsWith('.md')) return 'markdown'
  if (m.includes('text') || f.endsWith('.txt')) return 'text'
  if (isSpreadsheet(m, f)) return 'spreadsheet'
  return 'unknown'
}

function spreadsheetToText(buffer: Buffer): string {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const parts: string[] = []

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: '' })
    if (!rows.length) continue

    parts.push(`## ${sheetName}`)

    const [header, ...dataRows] = rows as string[][]
    if (!header?.length) continue

    const sep = header.map(() => '---').join(' | ')
    parts.push(header.join(' | '))
    parts.push(sep)
    for (const row of dataRows) {
      const padded = header.map((_, i) => String(row[i] ?? ''))
      parts.push(padded.join(' | '))
    }
    parts.push('')
  }

  return parts.join('\n')
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

  if (isSpreadsheet(mime, name)) {
    return spreadsheetToText(file.buffer)
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
      workspaceId: input.workspaceId,
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
  opts: { workspaceId: string },
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
      workspaceId: opts.workspaceId,
      ingestStatus: 'processing',
    },
  })

  const run = await start(ingestDocument, [document.id, content])
  return { documentId: document.id, title: document.title, runId: run.runId, status: 'processing' }
}

export async function createChatMemory(workspaceId: string, content: string) {
  const text = stripNul(content).trim()
  if (!text) return null
  const title = text.length > 80 ? text.slice(0, 80).trim() : text
  return ingestFromText({
    title: title || 'chat memory',
    content: text,
    sourceType: 'text',
    workspaceId,
    metadata: { kind: 'chat_memory' },
  })
}

export async function deleteChatMemories(workspaceId: string, term?: string) {
  const trimmedTerm = term?.trim()
  const conditions: Prisma.Sql[] = [
    Prisma.sql`"workspaceId" = ${workspaceId}`,
    Prisma.sql`metadata->>'kind' = 'chat_memory'`,
  ]

  if (trimmedTerm) {
    conditions.push(Prisma.sql`content ILIKE ${`%${trimmedTerm}%`}`)
  }

  const where = Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
  return prisma.$executeRaw(Prisma.sql`DELETE FROM "Document" ${where}`)
}

export async function listChatMemories(workspaceId: string): Promise<string[]> {
  const rows = await prisma.$queryRaw<Array<{ content: string }>>(Prisma.sql`
    SELECT content
    FROM "Document"
    WHERE "workspaceId" = ${workspaceId}
      AND metadata->>'kind' = 'chat_memory'
    ORDER BY "createdAt" DESC
    LIMIT 20
  `)

  return rows.map((r) => r.content)
}

export async function chatMemoryExists(
  workspaceId: string,
  contentSnippet: string,
): Promise<boolean> {
  const snippet = stripNul(contentSnippet).trim()
  if (!snippet) return false

  const rows = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
    SELECT id
    FROM "Document"
    WHERE "workspaceId" = ${workspaceId}
      AND metadata->>'kind' = 'chat_memory'
      AND content ILIKE ${`%${snippet}%`}
    LIMIT 1
  `)

  return rows.length > 0
}

export async function findAll(workspaceId: string) {
  return prisma.document.findMany({
    where: { workspaceId },
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

export async function removeDocument(documentId: string, workspaceId: string): Promise<void> {
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, workspaceId: true },
  })
  if (!doc) throw notFound('Document not found')
  if (doc.workspaceId !== workspaceId) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  await prisma.document.delete({ where: { id: documentId } })
}
