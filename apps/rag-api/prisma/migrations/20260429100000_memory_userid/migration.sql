-- Add per-user memory partitioning
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Helps filter documents/chunks by tenant/user during RAG retrieval
CREATE INDEX IF NOT EXISTS "Document_userId_idx" ON "Document"("userId");

