-- CreateTable: Workspace
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable: WorkspaceMember
CREATE TABLE "WorkspaceMember" (
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'editor',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("workspaceId","userId")
);

-- Add nullable workspaceId to Document and Conversation
ALTER TABLE "Document" ADD COLUMN "workspaceId" TEXT;
ALTER TABLE "Conversation" ADD COLUMN "workspaceId" TEXT;

-- Data migration: create a personal workspace per user and link their data
DO $$
DECLARE
    u RECORD;
    ws_id TEXT;
BEGIN
    FOR u IN SELECT id, name FROM "User" LOOP
        ws_id := gen_random_uuid()::TEXT;

        INSERT INTO "Workspace" ("id", "name", "ownerId", "createdAt")
        VALUES (ws_id, COALESCE(NULLIF(u.name, ''), 'My Workspace') || '''s Workspace', u.id, NOW());

        INSERT INTO "WorkspaceMember" ("workspaceId", "userId", "role", "createdAt")
        VALUES (ws_id, u.id, 'owner', NOW());

        UPDATE "Document" SET "workspaceId" = ws_id WHERE "userId" = u.id;
        UPDATE "Conversation" SET "workspaceId" = ws_id WHERE "userId" = u.id;
    END LOOP;

    -- Handle legacy documents (userId='legacy' or unmatched) — assign to first admin or delete
    DELETE FROM "Document" WHERE "workspaceId" IS NULL;
    DELETE FROM "Conversation" WHERE "workspaceId" IS NULL;
END;
$$;

-- Make workspaceId NOT NULL after data migration
ALTER TABLE "Document" ALTER COLUMN "workspaceId" SET NOT NULL;
ALTER TABLE "Conversation" ALTER COLUMN "workspaceId" SET NOT NULL;

-- Drop old userId columns
ALTER TABLE "Document" DROP COLUMN "userId";
ALTER TABLE "Conversation" DROP COLUMN "userId";

-- Add foreign key constraints
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_ownerId_fkey"
    FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Document" ADD CONSTRAINT "Document_workspaceId_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_workspaceId_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indices for workspaceId (userId indices are auto-dropped with the column)
CREATE INDEX "Document_workspaceId_idx" ON "Document"("workspaceId");
CREATE INDEX "Conversation_workspaceId_updatedAt_idx" ON "Conversation"("workspaceId", "updatedAt");

-- New indices
CREATE INDEX "Workspace_ownerId_idx" ON "Workspace"("ownerId");
CREATE INDEX "WorkspaceMember_userId_idx" ON "WorkspaceMember"("userId");
