# 🏗️ Technical Architecture

This document provides a deep dive into the technical architecture of the From Zero RAG system.

> **Note**: This document focuses on the core RAG application. For the **RAG Learning Quest** gamified tutorial system, see [learning notes](../learning/learning.md).

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Component Architecture](#component-architecture)
3. [Data Flow](#data-flow)
4. [RAG Pipeline](#rag-pipeline)
5. [Database Schema](#database-schema)
6. [API Design](#api-design)
7. [Performance Optimizations](#performance-optimizations)
8. [Security](#security)

---

## System Overview

### High-Level Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │  Web Browser    │  │  Mobile Browser │  │  API Clients    │      │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘      │
└───────────┼───────────────────┼───────────────────┼─────────────────┘
            │                   │                   │
            └───────────────────┴───────────────────┘
                                │
┌───────────────────────────────┼─────────────────────────────────────┐
│                    APPLICATION LAYER                                 │
│                                │                                     │
│  ┌────────────────────────────▼──────────────────────────────┐     │
│  │                 Nuxt 3 Frontend (SSR)                      │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │     │
│  │  │Components│  │  Pages   │  │  Stores  │  │   API    │  │     │
│  │  │  (Vue)   │  │ (Routes) │  │ (Pinia)  │  │ Client   │  │     │
│  │  └──────────┘  └──────────┘  └──────────┘  └────┬─────┘  │     │
│  └────────────────────────────────────────────────────┼───────┘     │
└───────────────────────────────────────────────────────┼─────────────┘
                                                        │
┌───────────────────────────────────────────────────────┼─────────────┐
│                      API LAYER                        │             │
│  ┌────────────────────────────────────────────────────▼──────────┐ │
│  │                   NestJS Backend API                           │ │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │ │
│  │  │Controllers│  │ Services  │  │    DTOs   │  │Middleware │  │ │
│  │  └─────┬─────┘  └─────┬─────┘  └───────────┘  └───────────┘  │ │
│  │        │              │                                        │ │
│  │  ┌─────▼──────────────▼───────┐                               │ │
│  │  │     Business Logic         │                               │ │
│  │  │  ┌──────────┐ ┌──────────┐│                               │ │
│  │  │  │Documents │ │  Search  ││                               │ │
│  │  │  │  Module  │ │  Module  ││                               │ │
│  │  │  └──────────┘ └──────────┘│                               │ │
│  │  └─────────────────────────────┘                               │ │
│  └────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
                    │                         │
┌───────────────────┼─────────────────────────┼─────────────────────────┐
│              DATA LAYER                     │                         │
│  ┌────────────────▼──────────────┐  ┌───────▼──────────┐             │
│  │      PostgreSQL + pgvector    │  │ External APIs    │             │
│  │  ┌──────────┐  ┌───────────┐  │  │ ┌──────────────┐ │             │
│  │  │Documents │  │   Chunks  │  │  │ │Google Gemini │ │             │
│  │  │  Table   │  │  Table    │  │  │ │ (Embeddings) │ │             │
│  │  └──────────┘  │(+vectors) │  │  │ └──────────────┘ │             │
│  │                └───────────┘  │  │ ┌──────────────┐ │             │
│  │  ┌──────────┐                 │  │ │Ollama Cloud  │ │             │
│  │  │ Queries  │                 │  │ │    (LLM)     │ │             │
│  │  │  Table   │                 │  │ └──────────────┘ │             │
│  │  └──────────┘                 │  └──────────────────┘             │
│  └────────────────────────────────┘                                   │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Backend Modules

#### 1. Documents Module

**Location**: `apps/rag-api/src/documents/`

**Responsibilities**:
- Document ingestion and processing
- Text chunking with overlap
- Embedding generation
- Metadata extraction

**Key Services**:

```typescript
// documents.service.ts
- createFromText(): Upload text document
- createFromFile(): Upload file (PDF, TXT, MD)
- processDocument(): Chunk + embed pipeline
- reprocess(): Re-chunk and re-embed

// chunking.service.ts
- chunkText(): Split text into overlapping segments
- Strategy: 512 chars, 50 char overlap
- Preserves sentence boundaries

// embedding.service.ts
- generate(): Create vector embedding
- Multi-provider: Google Gemini, OpenAI, Ollama
- LRU cache (256 entries)
- Dimensions: 768 (configurable)
```

#### 2. Search Module

**Location**: `apps/rag-api/src/search/`

**Responsibilities**:
- Vector similarity search
- RAG query processing
- Conversational context management
- Query tracking

**Key Services**:

```typescript
// search.service.ts
- search(): Vector similarity search
- rag(): Retrieval + context assembly
- converse(): Multi-turn RAG chat
- Uses pgvector cosine similarity
- HNSW index for performance

// Flow:
1. Embed query → 768-dim vector
2. pgvector similarity search
3. Rank by cosine distance
4. Return top-K chunks
```

#### 3. Agent Module

**Location**: `apps/rag-api/src/agent/`

**Responsibilities**:
- Planner-driven chat
- Route to knowledge base or direct response
- Intent detection

```typescript
// agent.service.ts
- chat(): Determine if KB search needed
- Uses LLM to plan actions
- Searches KB when relevant
- Falls back to direct LLM response
```

---

## Data Flow

### 1. Document Ingestion Flow

```
┌─────────────┐
│   Client    │
│  (Upload)   │
└──────┬──────┘
       │ POST /documents
       ▼
┌────────────────────┐
│  DocumentsController│
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│ DocumentsService   │───┐
│  processDocument() │   │
└────────────────────┘   │
       │                 │
       ▼                 │
┌────────────────────┐   │
│  ChunkingService   │   │
│   chunkText()      │   │
│  (512 char chunks) │   │
└──────┬─────────────┘   │
       │                 │
       ▼                 │
┌────────────────────┐   │
│ EmbeddingService   │◀──┘ Parallel batch processing
│   generate()       │     (Promise.all for chunks)
│  (768-dim vector)  │
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│    PostgreSQL      │
│   INSERT chunks    │
│ (text + embedding) │
└────────────────────┘
```

### 2. Search/RAG Flow

```
┌─────────────┐
│   Client    │
│  (Query)    │
└──────┬──────┘
       │ POST /search/rag
       ▼
┌────────────────────┐
│  SearchController  │
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│  SearchService     │
│     rag()          │
└──────┬─────────────┘
       │
       ├─────────────────────────┐
       │                         │
       ▼                         ▼
┌────────────────────┐  ┌────────────────────┐
│ EmbeddingService   │  │  QueryTracking     │
│ Embed query text   │  │  Log to DB         │
└──────┬─────────────┘  └────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│      pgvector Search               │
│  SELECT ... ORDER BY               │
│  embedding <=> $query_vector       │
│  LIMIT 5                           │
└──────┬─────────────────────────────┘
       │ Top-K chunks
       ▼
┌────────────────────┐
│  Context Assembly  │
│  Format chunks     │
│  Add metadata      │
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│   Ollama Cloud     │
│  LLM generation    │
│  (kimi-k2.5)       │
└──────┬─────────────┘
       │
       ▼
┌────────────────────┐
│   Response         │
│ - Answer text      │
│ - Source chunks    │
│ - Similarity scores│
└────────────────────┘
```

---

## RAG Pipeline

### Pipeline Stages

#### Stage 1: Ingestion

```typescript
Input: Raw document (text/PDF/MD)
↓
Text Extraction
├─ PDF: pdf-parse library
├─ Markdown: Direct text
└─ Text: Direct input
↓
Chunking
├─ Algorithm: Sliding window
├─ Size: 512 characters
├─ Overlap: 50 characters (10%)
└─ Boundary: Sentence-aware
↓
Embedding Generation
├─ Provider: Google Gemini
├─ Model: gemini-embedding-001
├─ Dimensions: 768
├─ Cache: LRU (prevent re-computation)
└─ Batch: Parallel processing
↓
Storage
├─ Document metadata → documents table
├─ Chunks + embeddings → chunks table
└─ pgvector index: HNSW algorithm
```

#### Stage 2: Retrieval

```typescript
Input: User query
↓
Query Embedding
├─ Same model as documents
├─ Same dimensions (768)
└─ Cache for repeat queries
↓
Vector Search
├─ Algorithm: Cosine similarity
├─ Index: pgvector HNSW
├─ SQL: embedding <=> query_vector
└─ Result: Top-K chunks (default: 5)
↓
Ranking
├─ Primary: Similarity score
├─ Optional: Recency boost
└─ Optional: Diversity
```

#### Stage 3: Augmentation

```typescript
Input: Query + Retrieved chunks
↓
Context Assembly
├─ Format: Numbered list
├─ Include: Source document title
├─ Include: Chunk text
└─ Include: Similarity score
↓
Prompt Construction
├─ System: "You are a helpful assistant..."
├─ Context: Assembled chunks
├─ Query: User question
└─ Instructions: Cite sources
↓
LLM Generation
├─ Provider: Ollama Cloud
├─ Model: kimi-k2.5:cloud
├─ Temperature: 0.7
├─ Max tokens: 2048
└─ Streaming: Supported
```

---

## Database Schema

### Tables

#### documents
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_type VARCHAR(50),  -- 'text', 'markdown', 'pdf'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### chunks
```sql
CREATE TABLE chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(768),  -- pgvector type
  start_char INT,
  end_char INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- HNSW index for fast similarity search
CREATE INDEX idx_chunks_embedding
ON chunks USING hnsw (embedding vector_cosine_ops);
```

#### queries
```sql
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text TEXT NOT NULL,
  query_embedding vector(768),
  results JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_chunks_document_id ON chunks(document_id);
CREATE INDEX idx_queries_created_at ON queries(created_at DESC);

-- Full-text search (optional future enhancement)
CREATE INDEX idx_chunks_content_fts
ON chunks USING gin(to_tsvector('english', content));
```

---

## API Design

### RESTful Principles

- **Resource-based URLs**: `/documents`, `/search`
- **HTTP verbs**: GET, POST, DELETE
- **Status codes**: 200 (OK), 201 (Created), 400 (Bad Request), 503 (Service Unavailable)
- **JSON payloads**: Consistent structure

### Error Handling

```typescript
// Standard error response
{
  "statusCode": 503,
  "message": "Failed to generate embedding",
  "error": "Service Unavailable"
}
```

### Pagination

```typescript
// List endpoints support pagination
GET /documents?page=1&limit=10

// Response includes metadata
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

---

## Performance Optimizations

### 1. Embedding Cache

```typescript
// LRU cache prevents re-computing embeddings
class LruCache<V> {
  private readonly store = new Map<string, V>();
  constructor(private readonly capacity: number) {}
  // Most recent embeddings stay in memory
  // Evicts oldest when full
}
```

### 2. Batch Processing

```typescript
// Parallel embedding generation
const embeddings = await Promise.all(
  chunks.map(chunk => this.embeddingService.generate(chunk.content))
);
```

### 3. Database Indexing

- **HNSW index**: Fast approximate nearest neighbor search
- **B-tree indexes**: Fast lookups on foreign keys
- **Connection pooling**: Reuse database connections

### 4. Docker Multi-Stage Builds

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
# ... build application

# Stage 2: Dependencies
FROM node:20-alpine AS deps
# ... production dependencies only

# Stage 3: Runner
FROM node:20-alpine AS runner
# ... minimal runtime image
```

---

## Security

### 1. Input Validation

- **DTO validation**: class-validator decorators
- **File upload limits**: Max 10MB
- **Content-Type checking**: PDF/TXT/MD only

### 2. SQL Injection Prevention

- **Prisma ORM**: Parameterized queries
- **No raw SQL**: Except for vector operations

### 3. API Rate Limiting

- **Embeddings**: Respect provider limits
- **Optional**: Add express-rate-limit middleware

### 4. Environment Variables

- **Secrets**: Never commit `.env`
- **Docker**: Use secrets management
- **Production**: Use vault services

---

## Scalability Considerations

### Horizontal Scaling

- **Stateless API**: Can run multiple instances
- **Shared database**: PostgreSQL handles concurrency
- **Load balancer**: Nginx or cloud LB

### Vertical Scaling

- **Database**: Increase PostgreSQL resources
- **Vector search**: HNSW scales to millions of vectors
- **Memory**: LRU cache size adjustable

### Future Enhancements

1. **Redis cache**: Shared cache across instances
2. **Message queue**: Async document processing
3. **CDN**: Frontend static assets
4. **Read replicas**: Separate read/write databases

---

## Monitoring & Observability

### Recommended Tools

- **Logging**: NestJS built-in logger
- **Metrics**: Prometheus + Grafana
- **Tracing**: OpenTelemetry
- **Error tracking**: Sentry

### Key Metrics

- Embedding generation time
- Search latency (p50, p95, p99)
- LLM response time
- Database query performance
- Cache hit rate

---

**Last Updated**: 2026-04-26
