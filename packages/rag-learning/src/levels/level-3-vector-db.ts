import { Level, Challenge } from '../types';

/**
 * LEVEL 3: Vector Database with pgvector
 *
 * Learning Objectives:
 * - Understand vector databases and their role in RAG
 * - Work with pgvector extension in PostgreSQL
 * - Implement vector similarity search
 * - Optimize with HNSW indexes
 */

export const level3: Level = {
  id: 3,
  title: 'Vector Database',
  description: 'Master pgvector and vector similarity search in PostgreSQL',
  icon: '🗄️',

  objectives: [
    'Understand what vector databases are and why RAG needs them',
    'Create tables with vector columns using pgvector',
    'Store and retrieve high-dimensional embeddings',
    'Perform similarity search using cosine distance',
    'Optimize search performance with HNSW indexes',
  ],

  challenges: [], // Will be populated below
  requiredChallenges: 2, // Must complete at least 2 of 3
  minXP: 550,

  completionBadge: {
    id: 'vector-wizard',
    name: 'Vector Wizard',
    description: 'Mastered vector databases and similarity search',
    icon: '🧙‍♂️',
    rarity: 'epic',
  },

  totalXP: 225,
};

// ============================================================================
// CHALLENGE 3.1: Creating a Vector Table
// ============================================================================

export const challenge3_1: Challenge = {
  id: 'vector-table-creation',
  level: 3,
  order: 1,
  title: 'Create a Vector Table',
  description: `
Learn to create PostgreSQL tables with vector columns using pgvector.

**What you'll learn:**
- pgvector extension basics
- Vector column data type
- Dimension specification
- Table constraints

**Your task:**
Write SQL to create a table that can store text embeddings.
  `,
  difficulty: 'easy',
  xp: {
    base: 50,
    bonus: 10,
  },

  theory: `
# Vector Databases: The Foundation of RAG

Traditional databases store **structured data** (numbers, strings, dates).
Vector databases store **high-dimensional vectors** (embeddings).

## Why Vector Databases?

RAG systems need to:
1. **Store** millions of embeddings
2. **Search** for similar vectors quickly
3. **Scale** to billions of vectors

Traditional databases can't do this efficiently!

## pgvector: PostgreSQL + Vectors

**pgvector** is a PostgreSQL extension that adds:
- **Vector data type**: Store arrays of floats as vectors
- **Distance operators**: Calculate similarity
- **Specialized indexes**: Fast approximate search

### Installation
\`\`\`sql
CREATE EXTENSION vector;
\`\`\`

### Vector Data Type

\`\`\`sql
-- Create a column that stores 768-dimensional vectors
embedding vector(768)
\`\`\`

**Dimensions must match your embedding model!**
- Google Gemini: 768
- OpenAI text-embedding-3-small: 1536
- OpenAI text-embedding-3-large: 3072

## Creating a Vector Table

\`\`\`sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(768),  -- 768-dimensional vectors
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

## Why This Matters

Without vector databases, RAG systems would need to:
- ❌ Compare query to EVERY document (slow!)
- ❌ Load all embeddings into memory (expensive!)
- ❌ Rebuild indexes constantly (fragile!)

With pgvector:
- ✅ Sub-millisecond similarity search
- ✅ Efficient storage
- ✅ Automatic index updates
  `,

  starterCode: `/**
 * Generate SQL to create a table for storing document embeddings
 *
 * Requirements:
 * - Table name: "chunks"
 * - Columns:
 *   - id: UUID primary key with auto-generation
 *   - document_id: UUID (foreign key reference)
 *   - content: Text content of the chunk
 *   - embedding: Vector with 768 dimensions
 *   - start_char: Integer (chunk start position)
 *   - end_char: Integer (chunk end position)
 *   - created_at: Timestamp with default NOW()
 *
 * @returns SQL CREATE TABLE statement as a string
 */
export function createChunksTable(): string {
  // TODO: Implement CREATE TABLE SQL
  //
  // Hints:
  // 1. Use gen_random_uuid() for UUID default
  // 2. Vector syntax: vector(dimensions)
  // 3. Foreign key: REFERENCES table_name(column)
  // 4. Timestamp default: DEFAULT NOW()

  throw new Error('Not implemented');
}`,

  solution: `export function createChunksTable(): string {
  return \`
    CREATE TABLE chunks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      embedding vector(768),
      start_char INT,
      end_char INT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  \`;
}`,

  testCases: [
    {
      id: 'test-3-1-table-name',
      description: 'Should create a table named "chunks"',
      input: {},
      expectedOutput: 'contains:CREATE TABLE chunks',
    },
    {
      id: 'test-3-1-vector-column',
      description: 'Should have embedding column with vector(768) type',
      input: {},
      expectedOutput: 'contains:vector(768)',
    },
    {
      id: 'test-3-1-foreign-key',
      description: 'Should reference documents table',
      input: {},
      expectedOutput: 'contains:REFERENCES documents',
    },
  ],

  validator: 'validators/vector-table-validator.ts',

  hints: [
    {
      id: 'hint-3-1-1',
      text: 'Use "vector(768)" as the data type for the embedding column',
      xpPenalty: 5,
      order: 1,
    },
    {
      id: 'hint-3-1-2',
      text: 'UUID primary key: "id UUID PRIMARY KEY DEFAULT gen_random_uuid()"',
      xpPenalty: 5,
      order: 2,
    },
    {
      id: 'hint-3-1-3',
      text: 'Check the actual schema in apps/rag-api/prisma/schema.prisma for reference',
      xpPenalty: 10,
      order: 3,
    },
  ],

  resources: [
    {
      title: 'pgvector Documentation',
      url: 'https://github.com/pgvector/pgvector',
      type: 'documentation',
    },
    {
      title: 'Vector Databases Explained',
      url: 'https://www.pinecone.io/learn/vector-database/',
      type: 'article',
    },
  ],

  tags: ['sql', 'pgvector', 'database-design'],
  estimatedTime: 15,
};

// ============================================================================
// CHALLENGE 3.2: Vector Insertion & Basic Queries
// ============================================================================

export const challenge3_2: Challenge = {
  id: 'vector-insertion-queries',
  level: 3,
  order: 2,
  title: 'Insert Vectors & Query',
  description: `
Learn to insert embeddings and perform basic vector queries.

**What you'll learn:**
- Inserting vectors into PostgreSQL
- Vector array syntax
- Basic SELECT queries with vectors
- Type casting and validation

**Your task:**
Write SQL to insert embeddings and retrieve them.
  `,
  difficulty: 'medium',
  xp: {
    base: 75,
    bonus: 15,
  },

  theory: `
# Working with Vectors in SQL

Once you have a vector table, you need to:
1. **Insert** embeddings
2. **Query** stored vectors
3. **Update** vectors
4. **Calculate** distances

## Inserting Vectors

### Array Literal Syntax
\`\`\`sql
INSERT INTO chunks (content, embedding)
VALUES (
  'Hello world',
  '[0.1, 0.2, 0.3, ..., 0.768]'::vector
);
\`\`\`

### From Application Code (JavaScript)
\`\`\`javascript
const embedding = [0.1, 0.2, 0.3, /* ... 768 numbers */];

await db.query(
  'INSERT INTO chunks (content, embedding) VALUES ($1, $2)',
  ['Hello world', JSON.stringify(embedding)]
);
\`\`\`

### Batch Insert (Efficient!)
\`\`\`sql
INSERT INTO chunks (content, embedding)
VALUES
  ('First chunk', '[0.1, 0.2, ...]'::vector),
  ('Second chunk', '[0.3, 0.4, ...]'::vector),
  ('Third chunk', '[0.5, 0.6, ...]'::vector);
\`\`\`

## Querying Vectors

### Basic SELECT
\`\`\`sql
SELECT id, content, embedding
FROM chunks
WHERE document_id = 'some-uuid';
\`\`\`

### Vector Dimensions
\`\`\`sql
-- Check vector dimensions
SELECT id, array_length(embedding) as dimensions
FROM chunks;
\`\`\`

### Validate Vectors
\`\`\`sql
-- Only return chunks with valid embeddings
SELECT *
FROM chunks
WHERE embedding IS NOT NULL
  AND array_length(embedding) = 768;
\`\`\`

## Common Pitfalls

❌ **Wrong dimension count**
\`\`\`sql
-- This will error if embedding has 767 or 769 elements
INSERT INTO chunks (embedding)
VALUES ('[0.1, 0.2]'::vector(768));  -- Error!
\`\`\`

❌ **Forgetting to cast**
\`\`\`sql
-- Need ::vector cast
INSERT INTO chunks (embedding)
VALUES ('[0.1, 0.2, ...]');  -- Won't work without ::vector
\`\`\`

✅ **Correct syntax**
\`\`\`sql
INSERT INTO chunks (content, embedding)
VALUES (
  'Document chunk',
  '[0.1, 0.2, 0.3]'::vector(3)
);
\`\`\`
  `,

  starterCode: `/**
 * Generate SQL to insert a chunk with its embedding
 *
 * @param documentId - UUID of the parent document
 * @param content - Text content of the chunk
 * @param embedding - Array of numbers (768-dimensional vector)
 * @param startChar - Starting character position
 * @param endChar - Ending character position
 * @returns SQL INSERT statement
 */
export function insertChunk(
  documentId: string,
  content: string,
  embedding: number[],
  startChar: number,
  endChar: number
): string {
  // TODO: Implement INSERT statement
  //
  // Steps:
  // 1. Convert embedding array to string: JSON.stringify(embedding)
  // 2. Use ::vector type cast
  // 3. Insert all columns
  // 4. Use single quotes for strings

  throw new Error('Not implemented');
}

/**
 * Generate SQL to find a chunk by ID
 *
 * @param chunkId - UUID of the chunk
 * @returns SQL SELECT statement
 */
export function findChunkById(chunkId: string): string {
  // TODO: Implement SELECT statement
  //
  // Select: id, content, embedding, document_id
  // Where: id = chunkId

  throw new Error('Not implemented');
}`,

  solution: `export function insertChunk(
  documentId: string,
  content: string,
  embedding: number[],
  startChar: number,
  endChar: number
): string {
  const embeddingStr = JSON.stringify(embedding);
  const escapedContent = content.replace(/'/g, "''");

  return \`
    INSERT INTO chunks (document_id, content, embedding, start_char, end_char)
    VALUES (
      '\${documentId}',
      '\${escapedContent}',
      '\${embeddingStr}'::vector,
      \${startChar},
      \${endChar}
    );
  \`;
}

export function findChunkById(chunkId: string): string {
  return \`
    SELECT id, content, embedding, document_id, start_char, end_char
    FROM chunks
    WHERE id = '\${chunkId}';
  \`;
}`,

  testCases: [
    {
      id: 'test-3-2-insert',
      description: 'Should insert a chunk with vector',
      input: {
        documentId: 'doc-123',
        content: 'Test chunk',
        embedding: [0.1, 0.2, 0.3],
        startChar: 0,
        endChar: 10,
      },
      expectedOutput: 'valid-insert',
    },
    {
      id: 'test-3-2-vector-cast',
      description: 'Should cast embedding to vector type',
      input: {
        documentId: 'doc-123',
        content: 'Test',
        embedding: [0.1],
        startChar: 0,
        endChar: 1,
      },
      expectedOutput: 'contains:::vector',
    },
    {
      id: 'test-3-2-select',
      description: 'Should select chunk by ID',
      input: { chunkId: 'chunk-456' },
      expectedOutput: 'valid-select',
    },
  ],

  validator: 'validators/vector-insertion-validator.ts',

  hints: [
    {
      id: 'hint-3-2-1',
      text: 'Convert array to string: JSON.stringify(embedding)',
      xpPenalty: 5,
      order: 1,
    },
    {
      id: 'hint-3-2-2',
      text: 'Use ::vector to cast the string to vector type',
      xpPenalty: 10,
      order: 2,
    },
    {
      id: 'hint-3-2-3',
      text: 'Escape single quotes in content: content.replace(/\'/g, "\'\'")',
      xpPenalty: 15,
      order: 3,
    },
  ],

  resources: [
    {
      title: 'pgvector SQL Examples',
      url: 'https://github.com/pgvector/pgvector#getting-started',
      type: 'documentation',
    },
  ],

  requiredChallenges: ['vector-table-creation'],
  tags: ['sql', 'vectors', 'crud'],
  estimatedTime: 20,
};

// ============================================================================
// CHALLENGE 3.3: Similarity Search with HNSW
// ============================================================================

export const challenge3_3: Challenge = {
  id: 'similarity-search-hnsw',
  level: 3,
  order: 3,
  title: 'Similarity Search with HNSW',
  description: `
Implement vector similarity search using HNSW indexes for speed.

**What you'll learn:**
- Cosine distance operator in pgvector
- HNSW (Hierarchical Navigable Small World) indexes
- Top-K similarity search
- Index optimization parameters

**Your task:**
Write SQL queries for efficient similarity search.
  `,
  difficulty: 'hard',
  xp: {
    base: 100,
    bonus: 25,
  },

  theory: `
# Similarity Search: The Heart of RAG

This is where the magic happens! Finding similar vectors efficiently.

## Distance Operators in pgvector

pgvector supports 3 distance metrics:

### 1. Cosine Distance (<=>)
**Most common for embeddings**
\`\`\`sql
SELECT content,
       embedding <=> '[0.1, 0.2, ...]'::vector AS distance
FROM chunks
ORDER BY distance
LIMIT 5;
\`\`\`

- **Range**: 0 (identical) to 2 (opposite)
- **Use when**: Embeddings are normalized
- **Best for**: Text similarity

### 2. Euclidean Distance (L2) (<->)
\`\`\`sql
SELECT embedding <-> '[0.1, 0.2, ...]'::vector AS distance
FROM chunks;
\`\`\`

- **Range**: 0 to ∞
- **Use when**: Absolute magnitude matters

### 3. Inner Product (<#>)
\`\`\`sql
SELECT embedding <#> '[0.1, 0.2, ...]'::vector AS distance
FROM chunks;
\`\`\`

- **Range**: -∞ to ∞
- **Use when**: Need dot product directly

## HNSW Indexes: Speed Boost

Without an index:
- **Complexity**: O(n) - check every vector
- **Time**: Slow for millions of vectors
- **Method**: Exact search

With HNSW index:
- **Complexity**: O(log n) - approximate
- **Time**: Sub-millisecond for millions
- **Method**: Graph-based search

### Creating HNSW Index
\`\`\`sql
CREATE INDEX idx_chunks_embedding
ON chunks USING hnsw (embedding vector_cosine_ops);
\`\`\`

### Index Parameters
\`\`\`sql
CREATE INDEX idx_chunks_embedding
ON chunks USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
\`\`\`

**Parameters**:
- **m**: Max connections per layer (default: 16)
  - Higher = better recall, more memory
  - Range: 2-100

- **ef_construction**: Size of dynamic candidate list (default: 64)
  - Higher = better quality, slower build
  - Range: 4-1000

## Query Performance

### Without Index (1M vectors)
\`\`\`
Query time: ~500ms (brute force)
\`\`\`

### With HNSW Index (1M vectors)
\`\`\`
Query time: ~5ms (200x faster!)
\`\`\`

## Complete Similarity Search

\`\`\`sql
-- Create index first (one-time setup)
CREATE INDEX idx_chunks_embedding
ON chunks USING hnsw (embedding vector_cosine_ops);

-- Search query
SELECT
  chunks.id,
  chunks.content,
  chunks.embedding <=> $1::vector AS similarity_score,
  documents.title
FROM chunks
JOIN documents ON chunks.document_id = documents.id
WHERE chunks.embedding IS NOT NULL
ORDER BY chunks.embedding <=> $1::vector
LIMIT 5;
\`\`\`

## Real-World Example from apps/rag-api

\`\`\`typescript
// apps/rag-api/src/search/search.service.ts:38
const results = await this.prisma.$queryRaw\`
  SELECT
    c.id as "chunkId",
    c.content,
    c.embedding <=> \${queryEmbedding}::vector as score,
    d.title as "documentTitle"
  FROM chunks c
  JOIN documents d ON c.document_id = d.id
  ORDER BY c.embedding <=> \${queryEmbedding}::vector
  LIMIT \${limit}
\`;
\`\`\`

## Trade-offs

**Exact Search (No Index)**
- ✅ 100% accurate
- ❌ Slow (O(n))
- Use for: Small datasets (<10k vectors)

**HNSW Index**
- ✅ Very fast (O(log n))
- ⚠️ ~99% accurate (approximate)
- Use for: Large datasets (>10k vectors)

For RAG, **HNSW is the standard choice**.
  `,

  starterCode: `/**
 * Generate SQL to create HNSW index for fast similarity search
 *
 * @returns SQL CREATE INDEX statement
 */
export function createHNSWIndex(): string {
  // TODO: Implement CREATE INDEX with HNSW
  //
  // Requirements:
  // - Index name: idx_chunks_embedding
  // - Table: chunks
  // - Column: embedding
  // - Method: HNSW with vector_cosine_ops
  // - Parameters: m=16, ef_construction=64

  throw new Error('Not implemented');
}

/**
 * Generate SQL to find similar chunks using cosine distance
 *
 * @param queryEmbedding - The query vector (768-dimensional)
 * @param limit - Maximum number of results to return
 * @returns SQL SELECT statement with similarity search
 */
export function findSimilarChunks(
  queryEmbedding: number[],
  limit: number = 5
): string {
  // TODO: Implement similarity search query
  //
  // Requirements:
  // - Use <=> (cosine distance) operator
  // - Order by distance (ascending = most similar first)
  // - Limit results
  // - Select: id, content, distance score

  throw new Error('Not implemented');
}`,

  solution: `export function createHNSWIndex(): string {
  return \`
    CREATE INDEX idx_chunks_embedding
    ON chunks USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
  \`;
}

export function findSimilarChunks(
  queryEmbedding: number[],
  limit: number = 5
): string {
  const embeddingStr = JSON.stringify(queryEmbedding);

  return \`
    SELECT
      id,
      content,
      embedding <=> '\${embeddingStr}'::vector AS distance
    FROM chunks
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> '\${embeddingStr}'::vector
    LIMIT \${limit};
  \`;
}`,

  testCases: [
    {
      id: 'test-3-3-index',
      description: 'Should create HNSW index with correct parameters',
      input: {},
      expectedOutput: 'valid-hnsw-index',
    },
    {
      id: 'test-3-3-similarity',
      description: 'Should use cosine distance operator (<=>)',
      input: { queryEmbedding: [0.1, 0.2, 0.3], limit: 5 },
      expectedOutput: 'contains:<=>',
    },
    {
      id: 'test-3-3-order',
      description: 'Should order by distance ascending',
      input: { queryEmbedding: [0.1, 0.2], limit: 3 },
      expectedOutput: 'contains:ORDER BY',
    },
  ],

  validator: 'validators/similarity-search-validator.ts',

  hints: [
    {
      id: 'hint-3-3-1',
      text: 'HNSW syntax: USING hnsw (column vector_cosine_ops)',
      xpPenalty: 10,
      order: 1,
    },
    {
      id: 'hint-3-3-2',
      text: 'Cosine distance operator is: <=>',
      xpPenalty: 15,
      order: 2,
    },
    {
      id: 'hint-3-3-3',
      text: 'Check apps/rag-api/src/search/search.service.ts:38 for reference implementation',
      xpPenalty: 20,
      order: 3,
    },
  ],

  resources: [
    {
      title: 'HNSW Algorithm Explained',
      url: 'https://www.pinecone.io/learn/hnsw/',
      type: 'article',
    },
    {
      title: 'pgvector Indexing Guide',
      url: 'https://github.com/pgvector/pgvector#indexing',
      type: 'documentation',
    },
  ],

  requiredChallenges: ['vector-insertion-queries'],
  tags: ['sql', 'similarity-search', 'hnsw', 'performance'],
  estimatedTime: 30,
};

// Add challenges to level
level3.challenges = [challenge3_1, challenge3_2, challenge3_3];
