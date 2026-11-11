-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'VALIDATION_PLAN_SET';

-- AlterEnum
ALTER TYPE "AgentNoteType" ADD VALUE 'PENDING_VALIDATION_PLAN';

-- AlterTable
ALTER TABLE "Embryo" ADD COLUMN "validationPlan" TEXT;
