-- CreateTable
CREATE TABLE "ReferenceIndex" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "markdown" TEXT NOT NULL,
    "commit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferenceIndex_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceIndex_userId_key" ON "ReferenceIndex"("userId");

-- AddForeignKey
ALTER TABLE "ReferenceIndex" ADD CONSTRAINT "ReferenceIndex_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Same as every other table: out of reach of Supabase's Data API (see lock_down_data_api)
ALTER TABLE "ReferenceIndex" ENABLE ROW LEVEL SECURITY;

-- AlterTable
ALTER TABLE "Embryo" ADD COLUMN "sourceContext" TEXT,
ADD COLUMN "sourceTitle" TEXT;
