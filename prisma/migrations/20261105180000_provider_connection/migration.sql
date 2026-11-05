-- CreateEnum
CREATE TYPE "LlmProvider" AS ENUM ('ANTHROPIC', 'OPENAI', 'OLLAMA_CLOUD');

-- CreateTable
CREATE TABLE "ProviderConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "LlmProvider" NOT NULL,
    "apiKeyCiphertext" TEXT NOT NULL,
    "apiKeyHint" TEXT NOT NULL,
    "collaboratorModel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProviderConnection_userId_key" ON "ProviderConnection"("userId");

-- AddForeignKey
ALTER TABLE "ProviderConnection" ADD CONSTRAINT "ProviderConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Same as every other table: out of reach of Supabase's Data API (see lock_down_data_api)
ALTER TABLE "ProviderConnection" ENABLE ROW LEVEL SECURITY;
