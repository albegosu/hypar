-- nomic-embed-text (Ollama default) uses 768 dimensions; column was vector(1536).
DROP INDEX IF EXISTS "Chunk_embedding_idx";

DELETE FROM "Chunk";

ALTER TABLE "Chunk" ALTER COLUMN embedding TYPE vector(768);

CREATE INDEX "Chunk_embedding_idx" ON "Chunk" USING hnsw (embedding vector_cosine_ops);
