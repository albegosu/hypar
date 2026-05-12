-- Backfill null userId with 'legacy' placeholder, then enforce NOT NULL
-- on Document and Conversation. Query.userId stays nullable (admin queries).

UPDATE "Document" SET "userId" = 'legacy' WHERE "userId" IS NULL;
ALTER TABLE "Document" ALTER COLUMN "userId" SET NOT NULL;

UPDATE "Conversation" SET "userId" = 'legacy' WHERE "userId" IS NULL;
ALTER TABLE "Conversation" ALTER COLUMN "userId" SET NOT NULL;
