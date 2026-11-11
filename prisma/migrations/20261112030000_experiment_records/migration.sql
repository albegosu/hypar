-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'EXPERIMENT_ADDED';
ALTER TYPE "EventType" ADD VALUE 'EXPERIMENT_UPDATED';
ALTER TYPE "EventType" ADD VALUE 'EXPERIMENT_SUPERSEDED';

-- CreateEnum
CREATE TYPE "ExperimentStatus" AS ENUM ('PLANNED', 'RUNNING', 'CONCLUDED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "ExperimentVerdict" AS ENUM ('SUPPORTS', 'REFUTES', 'INCONCLUSIVE');

-- CreateTable
CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL,
    "embryoId" TEXT NOT NULL,
    "hypothesis" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "status" "ExperimentStatus" NOT NULL DEFAULT 'PLANNED',
    "result" TEXT,
    "verdict" "ExperimentVerdict",
    "evidence" JSONB,
    "concludedAt" TIMESTAMP(3),
    "supersededAt" TIMESTAMP(3),
    "supersededReason" TEXT,
    "supersededById" TEXT,
    "createdBy" "EventInitiator" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Experiment_embryoId_createdAt_idx" ON "Experiment"("embryoId", "createdAt");

-- AddForeignKey
ALTER TABLE "Experiment" ADD CONSTRAINT "Experiment_embryoId_fkey" FOREIGN KEY ("embryoId") REFERENCES "Embryo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
