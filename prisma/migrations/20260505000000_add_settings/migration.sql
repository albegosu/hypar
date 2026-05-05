-- Add runtime-editable settings table.
-- key: env var name (e.g. SEARCH_TOP_K), value: string, category: embeddings|chunking|search|rag|general

CREATE TABLE "Setting" (
    "key"       TEXT NOT NULL,
    "value"     TEXT NOT NULL,
    "category"  TEXT NOT NULL DEFAULT 'general',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "Setting_category_idx" ON "Setting"("category");
