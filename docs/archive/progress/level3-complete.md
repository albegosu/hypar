# 🗄️ Level 3 Complete: Vector Database

## ✅ What's New

**Nivel 3: Vector Database** está ahora completamente implementado!

Este nivel introduce a los estudiantes al corazón de los sistemas RAG: **las bases de datos vectoriales**.

---

## 📊 Level Overview

| Métrica | Valor |
|---------|-------|
| **Nivel** | 3 |
| **Título** | Vector Database |
| **Icon** | 🗄️ |
| **Challenges** | 3 |
| **Total XP** | 225 |
| **Badge** | Vector Wizard 🧙‍♂️ (Epic) |
| **Requisito** | 550 XP total para desbloquear nivel 4 |

---

## 🎓 Learning Objectives

Los estudiantes que completen este nivel aprenderán:

1. ✅ **Qué son las bases de datos vectoriales** y por qué RAG las necesita
2. ✅ **Crear tablas con columnas vector** usando pgvector
3. ✅ **Almacenar y recuperar embeddings** de alta dimensionalidad
4. ✅ **Realizar búsquedas de similitud** usando distancia coseno
5. ✅ **Optimizar búsquedas** con índices HNSW

---

## 🎯 Challenges

### Challenge 3.1: Create a Vector Table ⚡
**Difficulty**: Easy
**XP**: 50 (base) + 10 (bonus)
**Time**: ~15 min

**What students learn**:
- pgvector extension basics
- Vector column data type syntax
- Dimension specification
- Foreign key constraints

**Task**:
```typescript
export function createChunksTable(): string {
  // Generate SQL CREATE TABLE with vector(768) column
}
```

**Key concepts**:
- `vector(768)` data type
- UUID primary keys
- Foreign key references
- Timestamp defaults

---

### Challenge 3.2: Vector Insertion & Queries 🔄
**Difficulty**: Medium
**XP**: 75 (base) + 15 (bonus)
**Time**: ~20 min

**What students learn**:
- Inserting vectors into PostgreSQL
- Vector array syntax and type casting
- Basic SELECT queries with vectors
- SQL injection prevention (escaping quotes)

**Task**:
```typescript
export function insertChunk(
  documentId: string,
  content: string,
  embedding: number[],
  startChar: number,
  endChar: number
): string {
  // Generate INSERT SQL with ::vector cast
}

export function findChunkById(chunkId: string): string {
  // Generate SELECT SQL
}
```

**Key concepts**:
- `::vector` type cast
- JSON.stringify for arrays
- String escaping
- CRUD operations

---

### Challenge 3.3: Similarity Search with HNSW 🚀
**Difficulty**: Hard
**XP**: 100 (base) + 25 (bonus)
**Time**: ~30 min

**What students learn**:
- Cosine distance operator (`<=>`)
- HNSW (Hierarchical Navigable Small World) indexes
- Top-K similarity search patterns
- Index optimization parameters (m, ef_construction)

**Task**:
```typescript
export function createHNSWIndex(): string {
  // CREATE INDEX with HNSW and parameters
}

export function findSimilarChunks(
  queryEmbedding: number[],
  limit: number = 5
): string {
  // SELECT with <=> operator for similarity
}
```

**Key concepts**:
- `<=>` cosine distance operator
- `USING hnsw` index method
- `vector_cosine_ops` operator class
- `ORDER BY distance` pattern
- Index tuning (m=16, ef_construction=64)

---

## 🔧 Technical Implementation

### New Files Created

```
packages/rag-learning/src/
├── levels/
│   └── level-3-vector-db.ts              ✅ 1,100+ lines
│
└── validators/
    ├── vector-table-validator.ts          ✅ 150 lines
    ├── vector-insertion-validator.ts      ✅ 200 lines
    └── similarity-search-validator.ts     ✅ 180 lines
```

### Total Lines of Code: ~1,630

---

## 🧪 Validators

### VectorTableValidator
**Tests**:
1. ✅ Table name is "chunks"
2. ✅ Has `vector(768)` column
3. ✅ Has foreign key to documents

**Validation logic**:
- Parses SQL string
- Checks for required keywords
- Validates structure

---

### VectorInsertionValidator
**Tests**:
1. ✅ Valid INSERT structure
2. ✅ Uses `::vector` type cast
3. ✅ Valid SELECT with WHERE clause

**Validation logic**:
- Validates INSERT syntax
- Checks type casting
- Verifies column inclusion

---

### SimilaritySearchValidator
**Tests**:
1. ✅ HNSW index with parameters
2. ✅ Uses `<=>` operator
3. ✅ Has ORDER BY and LIMIT

**Validation logic**:
- Checks HNSW syntax
- Validates distance operator
- Ensures proper ordering

---

## 📚 Theory Content

Each challenge includes comprehensive theory:

### Challenge 3.1 Theory
- Why vector databases matter
- pgvector extension overview
- Vector data type syntax
- Dimension matching importance
- Comparison: traditional vs vector DBs

### Challenge 3.2 Theory
- Inserting vectors (array literals)
- Batch insertion efficiency
- Querying vectors
- Common pitfalls and solutions
- Type casting best practices

### Challenge 3.3 Theory
- Distance operators comparison
  - Cosine distance (`<=>`)
  - Euclidean distance (`<->`)
  - Inner product (`<#>`)
- HNSW algorithm explained
- Index parameters tuning
- Performance benchmarks
- Trade-offs: exact vs approximate search

---

## 🎨 UI Integration

Updated `challenge/[id].vue` to support:
- ✅ VectorTableValidator
- ✅ VectorInsertionValidator
- ✅ SimilaritySearchValidator

**Validator mapping**:
```typescript
const validatorMap = {
  'vector-table-creation': VectorTableValidator,
  'vector-insertion-queries': VectorInsertionValidator,
  'similarity-search-hnsw': SimilaritySearchValidator,
};
```

---

## 💡 Real-World Connections

### Links to Actual Codebase

Each challenge references the production code:

**Challenge 3.1**:
- Points to `rag-api/prisma/schema.prisma`
- Shows actual table schema

**Challenge 3.2**:
- References insertion code in documents service
- Shows how embeddings are stored

**Challenge 3.3**:
- Points to `rag-api/src/search/search.service.ts:38`
- Shows real similarity search query

This creates a **bridge between theory and practice**!

---

## 📈 Learning Progression

### Cumulative Skills (Levels 1-3)

After completing Levels 1, 2, and 3, students can:

**From Level 1**:
- Generate embeddings
- Calculate similarity
- Implement caching

**From Level 2**:
- Chunk documents
- Add overlap
- Respect boundaries

**From Level 3** (NEW!):
- Create vector tables
- Store embeddings in PostgreSQL
- Perform similarity searches
- Optimize with HNSW indexes

**Real-world capability**: Students can now build a **complete RAG retrieval system**!

---

## 🎓 Educational Design

### Difficulty Curve
- **Level 1**: API integration → Moderate
- **Level 2**: Algorithms → Moderate to Hard
- **Level 3**: SQL + Vectors → Hard (new domain)

### Why This Order?
1. **Level 1**: Foundation (what are embeddings?)
2. **Level 2**: Preparation (how to split documents?)
3. **Level 3**: Storage & Retrieval (where/how to store?)
4. **Level 4** (next): Integration (put it all together)

### Hint Strategy
- **Easy hints** (5-10 XP): Syntax reminders
- **Medium hints** (10-15 XP): Algorithm hints
- **Hard hints** (15-20 XP): Point to reference code

---

## 📊 Statistics

### Level 3 Metrics

| Metric | Value |
|--------|-------|
| **Challenges** | 3 |
| **Total XP** | 225 |
| **Theory Content** | ~3,000 words |
| **Code Examples** | 15+ |
| **Test Cases** | 9 |
| **External Resources** | 5 links |
| **Estimated Time** | 65 minutes |

### Cumulative (Levels 1-3)

| Metric | Value |
|--------|-------|
| **Total Challenges** | 9 |
| **Total XP** | 650 |
| **Total Badges** | 3 (Master, Ninja, Wizard) |
| **Learning Time** | ~3.5 hours |
| **Lines of Code** | ~6,000+ |

---

## 🚀 How to Test Level 3

### 1. Install/Update Dependencies
```bash
pnpm install
```

### 2. Start Playground
```bash
pnpm dev:playground
```

### 3. Complete Prerequisites
- ✅ Complete Level 1 (200 XP)
- ✅ Complete Level 2 (225 XP)
- **Total needed**: 425 XP → Level 3 unlocks!

### 4. Try Challenges

**Challenge 3.1** (Easy):
```typescript
export function createChunksTable(): string {
  return `
    CREATE TABLE chunks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      embedding vector(768),
      start_char INT,
      end_char INT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
}
```

**Challenge 3.2** (Medium):
```typescript
export function insertChunk(
  documentId: string,
  content: string,
  embedding: number[],
  startChar: number,
  endChar: number
): string {
  const embeddingStr = JSON.stringify(embedding);
  const escapedContent = content.replace(/'/g, "''");

  return `
    INSERT INTO chunks (document_id, content, embedding, start_char, end_char)
    VALUES (
      '${documentId}',
      '${escapedContent}',
      '${embeddingStr}'::vector,
      ${startChar},
      ${endChar}
    );
  `;
}
```

**Challenge 3.3** (Hard):
```typescript
export function createHNSWIndex(): string {
  return `
    CREATE INDEX idx_chunks_embedding
    ON chunks USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);
  `;
}

export function findSimilarChunks(
  queryEmbedding: number[],
  limit: number = 5
): string {
  const embeddingStr = JSON.stringify(queryEmbedding);

  return `
    SELECT
      id,
      content,
      embedding <=> '${embeddingStr}'::vector AS distance
    FROM chunks
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> '${embeddingStr}'::vector
    LIMIT ${limit};
  `;
}
```

---

## 🎯 What Students Can Build Now

After completing Level 3, students have the knowledge to:

1. ✅ **Design a vector database schema**
   - Create tables with vector columns
   - Set appropriate dimensions
   - Add proper constraints

2. ✅ **Implement data ingestion**
   - Insert embeddings efficiently
   - Handle batch operations
   - Validate data integrity

3. ✅ **Build search functionality**
   - Query by similarity
   - Rank results
   - Optimize performance

4. ✅ **Production-ready patterns**
   - Use HNSW indexes
   - Tune parameters
   - Handle edge cases

**Combined with Levels 1-2**: They can build a **functional RAG retrieval backend**!

---

## 🔄 Next Steps

### Immediate
- Test all 3 challenges
- Earn "Vector Wizard" badge
- Reach 650 total XP

### Level 4 Preview (Coming Soon!)
**Retrieval Pipeline**
- Combine embeddings + chunks + search
- Implement full RAG query flow
- Add ranking and reranking
- Context assembly

**Level 5 Preview**:
**LLM Integration**
- Prompt engineering
- Context formatting
- Multi-turn conversation
- Citation tracking

**Level 6 Preview**:
**Production Optimization**
- Latency optimization
- Error handling
- Caching strategies
- Monitoring

---

## 📚 Resources Referenced

### In-Challenge Links
1. [pgvector Documentation](https://github.com/pgvector/pgvector)
2. [Vector Databases Explained](https://www.pinecone.io/learn/vector-database/)
3. [HNSW Algorithm](https://www.pinecone.io/learn/hnsw/)
4. [pgvector Indexing Guide](https://github.com/pgvector/pgvector#indexing)

### Codebase References
- `rag-api/prisma/schema.prisma` - Schema definition
- `rag-api/src/search/search.service.ts:38` - Similarity search
- `rag-api/src/documents/documents.service.ts` - Insertion

---

## 🏆 Achievement Unlocked!

**Level 3 Badge**: Vector Wizard 🧙‍♂️ (Epic Rarity)

**Description**: "Mastered vector databases and similarity search"

**Requirements to earn**:
- Complete 2 of 3 challenges minimum
- Reach 550 total XP
- Pass all validation tests

---

## 📊 Project Status

### Completed Levels: 3/6 (50%)

| Level | Status | XP | Badge |
|-------|--------|----|----|
| 1. Embeddings | ✅ | 200 | Embedding Master 🏆 |
| 2. Chunking | ✅ | 225 | Chunking Ninja 🥷 |
| 3. Vector DB | ✅ | 225 | Vector Wizard 🧙‍♂️ |
| 4. Retrieval | 📋 Planned | TBD | - |
| 5. LLM | 📋 Planned | TBD | - |
| 6. Optimization | 📋 Planned | TBD | - |

**Progress**: 50% complete!

---

## 🎉 Celebration!

**Half-way point reached!** 🎊

Students who complete Level 3 have mastered:
- ✅ The theory of RAG
- ✅ The data preparation
- ✅ The storage layer

**Next**: Put it all together in the retrieval pipeline!

---

**🎮 Ready to learn? Start at http://localhost:3002!**

**Total Available Content**: 9 challenges, 650 XP, 3 badges, ~3.5 hours of learning
