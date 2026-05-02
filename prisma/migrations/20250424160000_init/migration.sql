-- Create pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create Document table
CREATE TABLE "Document" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Chunk table with pgvector
CREATE TABLE "Chunk" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "documentId" TEXT NOT NULL REFERENCES "Document"(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536), -- For OpenAI/Ollama embeddings
    index INTEGER NOT NULL,
    "tokenCount" INTEGER,
    "startChar" INTEGER,
    "endChar" INTEGER,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Query table
CREATE TABLE "Query" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "queryText" TEXT NOT NULL,
    "responseText" TEXT,
    sources JSONB,
    "latencyMs" INTEGER,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX "Chunk_documentId_idx" ON "Chunk"("documentId");
CREATE INDEX "Chunk_embedding_idx" ON "Chunk" USING hnsw (embedding vector_cosine_ops);

-- Trigger to update updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_document_updated_at
    BEFORE UPDATE ON "Document"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
