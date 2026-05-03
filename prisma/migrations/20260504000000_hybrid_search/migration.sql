-- Hybrid search: add tsvector generated column + GIN index to Chunk.
-- This enables BM25 full-text scoring alongside pgvector cosine similarity,
-- which significantly improves recall for exact-term queries (names, codes, numbers).
--
-- Using 'simple' dictionary (no language-specific stemming) for multilingual support.
-- Change to 'english' or 'spanish' if your content is monolingual.

ALTER TABLE "Chunk"
  ADD COLUMN IF NOT EXISTS textsearch tsvector
    GENERATED ALWAYS AS (to_tsvector('simple', content)) STORED;

CREATE INDEX IF NOT EXISTS "Chunk_textsearch_gin_idx"
  ON "Chunk" USING gin(textsearch);
