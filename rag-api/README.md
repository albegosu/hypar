# PKM RAG API

Personal Knowledge Management API with RAG (Retrieval-Augmented Generation) support.

## Stack

- **NestJS** - API framework
- **PostgreSQL + pgvector** - Vector database
- **Prisma** - Database ORM
- **Ollama** - Local embeddings (nomic-embed-text)
- **OpenAI** - Optional cloud embeddings

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Setup PostgreSQL with pgvector

Using Docker:
```bash
docker run -d \
  --name pkm-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=pkm_rag \
  -p 5432:5432 \
  pgvector/pgvector:pg16
```

Or install pgvector extension locally:
```bash
# macOS
brew install pgvector

# Then in psql:
CREATE EXTENSION vector;
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your database URL
```

### 4. Setup database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Setup Ollama (for local embeddings)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull embedding model
ollama pull nomic-embed-text

# Start Ollama
ollama serve
```

### 6. Run the API

```bash
npm run start:dev
```

## API Endpoints

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/documents` | Create document from text |
| POST | `/documents/upload` | Upload file (PDF, text, markdown) |
| GET | `/documents` | List all documents |
| GET | `/documents/:id` | Get document with chunks |
| POST | `/documents/:id/reprocess` | Re-chunk and re-embed |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/search` | Semantic search (returns ranked chunks) |
| POST | `/search/rag` | RAG search (returns context + sources, no LLM call) |
| POST | `/search/converse` | Multi-turn RAG chat (LLM + sources) |

### Agent

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/agent/chat` | Planner-driven chat: routes to KB search or direct reply |

## Example Usage

### Create a document

```bash
curl -X POST http://localhost:3001/documents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Notes on RAG",
    "content": "RAG stands for Retrieval-Augmented Generation...",
    "sourceType": "markdown"
  }'
```

### Search

```bash
curl -X POST http://localhost:3001/search \
  -H "Content-Type: application/json" \
  -d '{"query": "What is RAG?"}'
```

### RAG Query

```bash
curl -X POST http://localhost:3001/search/rag \
  -H "Content-Type: application/json" \
  -d '{"query": "Explain RAG architecture", "limit": 5}'
```

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Nuxt 3    │────▶│  NestJS API  │────▶│  PostgreSQL     │
│  (Frontend) │     │              │     │  + pgvector     │
└─────────────┘     └──────────────┘     └─────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │   Ollama     │
                    │  (embeddings) │
                    └──────────────┘
```

## Next Steps

- [x] Native pgvector similarity search with HNSW index
- [x] LLM response generation (Ollama / OpenAI fallback)
- [x] PDF parsing (`pdf-parse`)
- [x] Nuxt 3 frontend (see `rag-ui/`)
- [ ] Web scraping ingestion
- [ ] Semantic "related documents" feature
- [ ] Hybrid search (vector + BM25 full-text)

## License

Private - Alberto
