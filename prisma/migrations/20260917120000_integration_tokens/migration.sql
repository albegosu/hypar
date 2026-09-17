-- AlterTable
ALTER TABLE "Embryo" ADD COLUMN "sourceRef" TEXT,
ADD COLUMN "sourceUrl" TEXT;

-- CreateTable
CREATE TABLE "IntegrationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "IntegrationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationToken_hash_key" ON "IntegrationToken"("hash");

-- CreateIndex
CREATE INDEX "IntegrationToken_userId_idx" ON "IntegrationToken"("userId");

-- CreateIndex
CREATE INDEX "Embryo_userId_sourceUrl_idx" ON "Embryo"("userId", "sourceUrl");

-- AddForeignKey
ALTER TABLE "IntegrationToken" ADD CONSTRAINT "IntegrationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
