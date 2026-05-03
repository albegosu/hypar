-- Robustify MVP: ingest status, conversations, messages, query auditing.

-- 0. Fix the broken trigger function from the init migration.
--    The original used NEW.updatedAt (unquoted → lowercase "updatedat") which
--    does not match the case-sensitive column "updatedAt". Fix it once here so
--    all future UPDATEs on Document work correctly.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. Document: ingestion status visible from outside the workflow.
ALTER TABLE "Document"
  ADD COLUMN IF NOT EXISTS "ingestStatus" TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS "ingestError"  TEXT,
  ADD COLUMN IF NOT EXISTS "chunkCount"   INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "Document_ingestStatus_idx" ON "Document"("ingestStatus");

-- Backfill: any existing doc with chunks is considered ready.
-- Disable the trigger while backfilling to avoid the updatedAt side-effect
-- (Prisma manages updatedAt at the ORM level anyway).
ALTER TABLE "Document" DISABLE TRIGGER update_document_updated_at;

UPDATE "Document" d
SET "ingestStatus" = 'ready',
    "chunkCount"   = (SELECT COUNT(*) FROM "Chunk" c WHERE c."documentId" = d.id)
WHERE EXISTS (SELECT 1 FROM "Chunk" c WHERE c."documentId" = d.id);

ALTER TABLE "Document" ENABLE TRIGGER update_document_updated_at;

-- 2. Chunk.embedding NOT NULL (was nullable in Prisma schema).
-- Drop any rows with NULL embedding before tightening the constraint.
DELETE FROM "Chunk" WHERE embedding IS NULL;

DO $$ BEGIN
  IF (SELECT is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name   = 'Chunk'
        AND column_name  = 'embedding') = 'YES'
  THEN
    ALTER TABLE "Chunk" ALTER COLUMN embedding SET NOT NULL;
  END IF;
END $$;

-- 3. Conversation table.
CREATE TABLE IF NOT EXISTS "Conversation" (
  id          TEXT PRIMARY KEY,
  "userId"    TEXT,
  title       TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Conversation_userId_updatedAt_idx"
  ON "Conversation"("userId", "updatedAt");

-- 4. Message table.
CREATE TABLE IF NOT EXISTS "Message" (
  id               TEXT PRIMARY KEY,
  "conversationId" TEXT NOT NULL,
  role             TEXT NOT NULL,
  content          TEXT NOT NULL,
  parts            JSONB,
  sources          JSONB,
  "errorMessage"   TEXT,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Message_conversationId_fkey"
    FOREIGN KEY ("conversationId") REFERENCES "Conversation"(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Message_conversationId_createdAt_idx"
  ON "Message"("conversationId", "createdAt");

-- 5. Query auditing: link to user and conversation, track tool usage.
ALTER TABLE "Query"
  ADD COLUMN IF NOT EXISTS "userId"         TEXT,
  ADD COLUMN IF NOT EXISTS "conversationId" TEXT,
  ADD COLUMN IF NOT EXISTS "toolCalled"     BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS "Query_userId_createdAt_idx"
  ON "Query"("userId", "createdAt");
