/**
 * Reingest every existing document. Run after schema or chunking changes
 * (notably after the sanitizePgText fix, which silently corrupted content).
 *
 *   pnpm reingest
 */
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { splitIntoChunks } from '../server/utils/chunking'
import { generateEmbeddings, invalidateEmbeddingCache } from '../server/utils/embedding'
import { stripNul } from '../server/utils/text'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is not set')
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
} as ConstructorParameters<typeof PrismaClient>[0])

async function reingest(documentId: string, content: string): Promise<number> {
  const chunks = splitIntoChunks(content)
  if (!chunks.length) return 0

  const chunkTexts = chunks.map((c) => c.content)
  await invalidateEmbeddingCache(chunkTexts)
  const embeddings = await generateEmbeddings(chunkTexts)

  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`DELETE FROM "Chunk" WHERE "documentId" = $1`, documentId)
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i]
      const embStr = `[${embeddings[i].join(',')}]`
      await tx.$executeRawUnsafe(
        `INSERT INTO "Chunk" (id, "documentId", content, embedding, index, "tokenCount", "startChar", "endChar", "createdAt")
         VALUES (gen_random_uuid(), $1, $2, $3::vector, $4, $5, $6, $7, NOW())`,
        documentId,
        stripNul(c.content),
        embStr,
        i,
        c.tokenCount,
        c.startChar,
        c.endChar,
      )
    }
  })

  await prisma.document.update({
    where: { id: documentId },
    data: { ingestStatus: 'ready', ingestError: null, chunkCount: chunks.length },
  })

  return chunks.length
}

async function main() {
  const docs = await prisma.document.findMany({ select: { id: true, title: true, content: true } })
  console.log(`Reingesting ${docs.length} documents…`)

  let ok = 0
  let failed = 0
  for (const d of docs) {
    try {
      const n = await reingest(d.id, d.content)
      console.log(`  ✓ ${d.id}  ${d.title}  (${n} chunks)`)
      ok++
    } catch (err) {
      console.error(`  ✗ ${d.id}  ${d.title}: ${(err as Error).message}`)
      await prisma.document.update({
        where: { id: d.id },
        data: { ingestStatus: 'failed', ingestError: (err as Error).message },
      })
      failed++
    }
  }
  console.log(`\nDone. ${ok} ok, ${failed} failed.`)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
