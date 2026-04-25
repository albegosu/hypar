-- Speeds up the /admin/queries timeline (ORDER BY "createdAt" DESC LIMIT N).
CREATE INDEX IF NOT EXISTS "Query_createdAt_idx" ON "Query"("createdAt");
