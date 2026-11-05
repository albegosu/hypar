-- ADR 0005: MATURE becomes MATURING; TRANSPLANTED is the success end state.

-- AlterEnum
ALTER TYPE "EmbryoState" RENAME VALUE 'MATURE' TO 'MATURING';
ALTER TYPE "EmbryoState" ADD VALUE 'TRANSPLANTED';

-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'TRANSPLANT_PROPOSED';
ALTER TYPE "EventType" ADD VALUE 'TRANSPLANTED';
ALTER TYPE "EventType" ADD VALUE 'USER_NOTE';

-- AlterEnum
ALTER TYPE "AgentNoteType" ADD VALUE 'PENDING_TRANSPLANT';

-- AlterTable
ALTER TABLE "Embryo" ADD COLUMN "transplantedAt" TIMESTAMP(3),
ADD COLUMN "transplantReason" TEXT,
ADD COLUMN "transplantOutcome" TEXT;

-- Keep event history consistent with the renamed state.
UPDATE "EmbryoEvent" SET "payload" = jsonb_set("payload"::jsonb, '{from}', '"MATURING"') WHERE "payload"->>'from' = 'MATURE';
UPDATE "EmbryoEvent" SET "payload" = jsonb_set("payload"::jsonb, '{to}', '"MATURING"') WHERE "payload"->>'to' = 'MATURE';
UPDATE "EmbryoEvent" SET "payload" = jsonb_set("payload"::jsonb, '{previousState}', '"MATURING"') WHERE "payload"->>'previousState' = 'MATURE';
