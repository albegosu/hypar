# 🔧 RAG API - Backend Service

NestJS backend API for RAG capabilities.

---

## 🎯 Overview

The RAG API provides a robust backend for document management, semantic search, and retrieval-augmented generation. Built with NestJS, it features multi-provider embeddings, pgvector integration, and comprehensive error handling.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Architecture](#-architecture)
- [Configuration](#-configuration)
- [Testing](#-testing)
- [Deployment](#-deployment)

---

## ✨ Features

### Core Capabilities
- 📄 **Document Management** - Upload, process, and manage documents
- 🔍 **Vector Search** - Semantic similarity search with pgvector
- 🤖 **RAG Pipeline** - Retrieval-augmented generation
- 💬 **Conversational AI** - Multi-turn dialogue with context
- 📊 **Analytics** - Query tracking and statistics

### Technical Features
- 🎯 **Multi-provider Embeddings** - Google Gemini, OpenAI, Ollama
- 💾 **Efficient Caching** - LRU cache for embeddings
- ⚡ **Async Processing** - Parallel chunk processing
- 🔒 **Type Safety** - Full TypeScript + Prisma
- 🐳 **Docker Ready** - Production-optimized build

---

## 🔧 Tech Stack

- **Framework**: NestJS 10.3
- **Database**: PostgreSQL with pgvector
- **ORM**: Prisma 7.8
- **Embeddings**: Google Gemini / OpenAI / Ollama
- **LLM**: Ollama Cloud / Local
- **Language**: TypeScript 5.3
- **Testing**: Jest
- **Validation**: class-validator
- **PDF Parsing**: pdf-parse

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js 20+
PostgreSQL 16+ with pgvector extension
Google Gemini API key (free)
```

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

#### Option A: Docker (Recommended)

```bash
docker run -d \
  --name rag-postgres \
  -e POSTGRES_USER=rag \
  -e POSTGRES_PASSWORD=rag_password \
  -e POSTGRES_DB=rag_db \
  -p 5432:5432 \
  pgvector/pgvector:pg16
```

#### Option B: Local PostgreSQL

```bash
# Install pgvector extension
# macOS
brew install pgvector

# Then in psql
CREATE EXTENSION vector;
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL="postgresql://rag:rag_password@localhost:5432/rag_db"

# Embeddings - Get free key at: https://aistudio.google.com/app/apikey
GOOGLE_API_KEY=your_gemini_api_key

# LLM - Get free key at: https://ollama.com/settings/keys
OLLAMA_URL=https://ollama.com
OLLAMA_API_KEY=your_ollama_api_key
OLLAMA_LLM_MODEL=kimi-k2.5:cloud

# Optional: OpenAI (alternative to Google Gemini)
OPENAI_API_KEY=

# Embedding dimensions (must match pgvector schema)
EMBEDDING_DIMENSIONS=768
```

### 4. Setup Database Schema

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run Development Server

```bash
npm run start:dev
```

API will be available at: http://localhost:3001

---

## 📡 API Endpoints

### Health Check

```http
GET /health
```

### Documents API

#### Create Document
```http
POST /documents
Content-Type: application/json

{
  "title": "Document Title",
  "content": "Document content...",
  "sourceType": "text" | "markdown"
}
```

#### Upload File
```http
POST /documents/upload
Content-Type: multipart/form-data

file: <PDF/TXT/MD file>
```

#### List Documents
```http
GET /documents?page=1&limit=10
```

#### Get Document
```http
GET /documents/:id
```

#### Reprocess Document
```http
POST /documents/:id/reprocess
```

#### Delete Document
```http
DELETE /documents/:id
```

### Search API

#### Semantic Search
```http
POST /search
Content-Type: application/json

{
  "query": "What is RAG?",
  "limit": 5
}
```

**Response**:
```json
[
  {
    "chunkId": "uuid",
    "content": "RAG stands for...",
    "documentId": "uuid",
    "documentTitle": "RAG Guide",
    "score": 0.85,
    "startChar": 0,
    "endChar": 500
  }
]
```

#### RAG Query
```http
POST /search/rag
Content-Type: application/json

{
  "query": "Explain RAG architecture",
  "limit": 5
}
```

**Response**:
```json
{
  "context": "Retrieved context...",
  "sources": [
    {
      "chunkId": "uuid",
      "content": "...",
      "score": 0.85
    }
  ]
}
```

#### Conversational Chat
```http
POST /search/converse
Content-Type: application/json

{
  "message": "Tell me more about embeddings",
  "conversationHistory": [
    {
      "role": "user",
      "content": "What is RAG?"
    },
    {
      "role": "assistant",
      "content": "RAG is..."
    }
  ]
}
```

### Agent API

#### Planner Chat
```http
POST /agent/chat
Content-Type: application/json

{
  "message": "What did we discuss about vector databases?",
  "sessionId": "optional-session-id"
}
```

### Admin API

#### Query Statistics
```http
GET /admin/stats
```

#### Recent Queries
```http
GET /admin/queries?limit=10
```

---

## 🏗️ Architecture

### Module Structure

```
src/
├── app.module.ts           # Root module
├── main.ts                 # Application entry
│
├── documents/              # Document ingestion
│   ├── documents.module.ts
│   ├── documents.controller.ts
│   ├── documents.service.ts
│   ├── chunking.service.ts      # Text splitting
│   ├── embedding.service.ts     # Multi-provider embeddings
│   └── dto/
│       └── create-document.dto.ts
│
├── search/                 # RAG & Search
│   ├── search.module.ts
│   ├── search.controller.ts
│   ├── search.service.ts        # Vector search + RAG
│   └── dto/
│       ├── search.dto.ts
│       └── converse.dto.ts
│
├── agent/                  # Conversational AI
│   ├── agent.module.ts
│   ├── agent.controller.ts
│   ├── agent.service.ts         # Planner-driven chat
│   └── dto/
│       └── agent-chat.dto.ts
│
├── admin/                  # Analytics
│   ├── admin.module.ts
│   ├── admin.controller.ts
│   └── admin.service.ts
│
├── ollama/                 # Ollama integration
│   └── create-ollama.ts         # Client factory
│
└── prisma/                 # Database
    └── prisma.service.ts        # Prisma client
```

### Service Responsibilities

#### DocumentsService
- Orchestrates document ingestion
- Manages document lifecycle
- Triggers chunking and embedding

#### ChunkingService
- Splits documents into chunks
- Strategy: 512 chars with 50 char overlap
- Sentence-boundary aware

#### EmbeddingService
- Generates vector embeddings
- Multi-provider support (Google/OpenAI/Ollama)
- LRU cache for performance
- Fallback chain

#### SearchService
- Vector similarity search
- RAG context assembly
- Multi-turn conversation
- Query tracking

#### AgentService
- Intent-based routing
- KB search when relevant
- Direct LLM fallback

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `GOOGLE_API_KEY` | Google Gemini API key | Optional |
| `OPENAI_API_KEY` | OpenAI API key | Optional |
| `OLLAMA_URL` | Ollama endpoint | `http://localhost:11434` |
| `OLLAMA_API_KEY` | Ollama Cloud API key | Optional |
| `OLLAMA_MODEL` | Embedding model name | `nomic-embed-text` |
| `OLLAMA_LLM_MODEL` | LLM model name | `kimi-k2.5:cloud` |
| `EMBEDDING_DIMENSIONS` | Vector dimensions | `768` |
| `OLLAMA_CHAT_TIMEOUT_MS` | LLM timeout | `180000` |
| `OLLAMA_PLANNER_TIMEOUT_MS` | Planner timeout | `60000` |

### Embedding Provider Priority

The system automatically selects providers in this order:

1. **Google Gemini** (if `GOOGLE_API_KEY` set) - Free, 10M tokens/min
2. **OpenAI** (if `OPENAI_API_KEY` set) - Paid, reliable
3. **Ollama** (fallback) - Local or cloud

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Test Database

Tests use a separate database:

```env
DATABASE_URL="postgresql://test:test@localhost:5432/test"
```

---

## 🚀 Deployment

### Docker

```bash
# Build
docker build -t rag-api .

# Run
docker run -p 3001:3001 \
  -e DATABASE_URL=... \
  -e GOOGLE_API_KEY=... \
  rag-api
```

### Production Build

```bash
npm run build
npm run start:prod
```

### Environment Checklist

- ✅ Set production `DATABASE_URL`
- ✅ Add `GOOGLE_API_KEY` or `OPENAI_API_KEY`
- ✅ Configure `OLLAMA_URL` and `OLLAMA_API_KEY`
- ✅ Set secure `POSTGRES_PASSWORD`
- ✅ Enable SSL for database connection
- ✅ Configure connection pooling
- ✅ Set up monitoring

---

## 📊 Performance Tips

### Database Optimization

```sql
-- HNSW index for fast vector search
CREATE INDEX idx_chunks_embedding
ON chunks USING hnsw (embedding vector_cosine_ops);

-- Adjust HNSW parameters for your dataset
ALTER INDEX idx_chunks_embedding
SET (m = 16, ef_construction = 64);
```

### Caching

- Embedding cache: 256 entries (configurable)
- Consider Redis for distributed cache
- Cache query results for common searches

### Batch Processing

- Chunks processed in parallel: `Promise.all`
- Adjust batch size based on memory
- Consider message queue for large documents

---

## 🛠️ Development

### Code Style

```bash
# Lint
npm run lint

# Format
npm run format
```

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (⚠️ deletes data)
npx prisma migrate reset
```

### Prisma Studio

```bash
npx prisma studio
```

---

## 📚 Learn More

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Technical Architecture](../docs/architecture/core-rag-architecture.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📄 License

MIT License - See [LICENSE](../LICENSE)

---

**Built with ❤️ using NestJS and modern AI technologies**
