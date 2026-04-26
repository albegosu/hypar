# 🧠 PKM RAG - Personal Knowledge Management with RAG

A production-ready full-stack application for managing personal knowledge with AI-powered **Retrieval-Augmented Generation (RAG)**. Built to demonstrate modern RAG architecture, vector databases, and cloud-native deployment.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.3-red)](https://nestjs.com/)
[![Nuxt](https://img.shields.io/badge/Nuxt-3-green)](https://nuxt.com/)
[![pgvector](https://img.shields.io/badge/pgvector-0.5-purple)](https://github.com/pgvector/pgvector)

---

## 📖 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [RAG Pipeline](#-rag-pipeline-explained)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Learning Resources](#-learning-resources)

---

## ✨ Features

### Core RAG Capabilities
- 🔍 **Semantic Search** - Vector similarity search with pgvector
- 🤖 **RAG Mode** - Context-aware AI responses with source citations
- 💬 **Conversational AI** - Multi-turn dialogue with memory
- 📊 **Intelligent Chunking** - Optimized document splitting with overlap

### Document Management
- 📄 **Multi-format Support** - Text, Markdown, PDF
- ⚡ **Real-time Processing** - Async document ingestion
- 🔄 **Reprocessing** - Update embeddings on demand
- 📈 **Analytics** - Query history and stats

### Technical Features
- 🎯 **Multi-provider Embeddings** - Google Gemini, OpenAI, or Ollama
- 🚀 **Cloud-Ready** - Deploy on Vercel, Railway, or Render
- 🐳 **Docker Support** - One-command full stack
- 💾 **Efficient Caching** - LRU cache for embeddings
- 🔒 **Type Safety** - Full TypeScript + Prisma

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                     Nuxt 3 + Vue 3 + Tailwind                   │
└────────────────┬───────────────────────┬────────────────────────┘
                 │                       │
                 ▼                       ▼
        ┌────────────────┐      ┌────────────────┐
        │  Document API  │      │   Search API   │
        │   (Upload)     │      │  (RAG/Vector)  │
        └────────┬───────┘      └────────┬───────┘
                 │                       │
                 ▼                       ▼
        ┌─────────────────────────────────────────┐
        │          NestJS Backend API              │
        │  ┌──────────┐  ┌──────────┐  ┌────────┐│
        │  │Chunking  │  │Embedding │  │Search  ││
        │  │Service   │  │Service   │  │Service ││
        │  └──────────┘  └──────────┘  └────────┘│
        └─────────┬──────────────┬────────────────┘
                  │              │
                  ▼              ▼
        ┌──────────────┐  ┌──────────────────┐
        │  PostgreSQL  │  │ Embedding Provider│
        │  + pgvector  │  │ (Gemini/OpenAI)  │
        │   (Vector    │  └──────────────────┘
        │   Database)  │
        └──────────────┘
```

### RAG Flow

```
1. INGESTION PIPELINE
   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
   │ Document │───▶│ Chunking │───▶│Embedding │───▶│  Store   │
   │  Upload  │    │(512 char)│    │(768 dims)│    │(pgvector)│
   └──────────┘    └──────────┘    └──────────┘    └──────────┘

2. RETRIEVAL PIPELINE
   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
   │  Query   │───▶│ Embed    │───▶│ Vector   │───▶│ Top-K    │
   │  Text    │    │  Query   │    │  Search  │    │ Chunks   │
   └──────────┘    └──────────┘    └──────────┘    └──────────┘

3. GENERATION PIPELINE
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │ Context  │───▶│   LLM    │───▶│ Response │
   │ + Query  │    │ (Ollama) │    │+ Sources │
   └──────────┘    └──────────┘    └──────────┘
```

---

## 🔧 Tech Stack

### Frontend
- **Nuxt 3** - Full-stack Vue framework
- **Nuxt UI** - Beautiful component library
- **Tailwind CSS** - Utility-first styling
- **Pinia** - State management
- **TypeScript** - Type safety

### Backend
- **NestJS** - Enterprise Node.js framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Primary database
- **pgvector** - Vector similarity search
- **TypeScript** - End-to-end type safety

### AI/ML
- **Google Gemini** - Free embeddings (10M tokens/min)
- **OpenAI** - Alternative embeddings provider
- **Ollama Cloud** - Cloud-hosted LLM
- **Ollama Local** - Local LLM option

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD (ready)

---

## 🚀 Quick Start

### Prerequisites
```bash
- Docker 20.10+
- Docker Compose 2.0+
- 4GB+ RAM
- Google Gemini API key (free)
```

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/from-zero-rag.git
cd from-zero-rag
```

### 2. Configure Environment
```bash
cp .env.docker .env
```

Edit `.env` and add your API keys:
```env
# Get free API key at: https://aistudio.google.com/app/apikey
GOOGLE_API_KEY=your_gemini_api_key

# Get free API key at: https://ollama.com/settings/keys
OLLAMA_API_KEY=your_ollama_api_key
OLLAMA_LLM_MODEL=kimi-k2.5:cloud
OLLAMA_URL=https://ollama.com
```

### 3. Start Application
```bash
docker-compose up -d --build
```

### 4. Access Services
| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Web UI |
| **Backend API** | http://localhost:3001 | REST API |
| **API Docs** | http://localhost:3001/api | Swagger |

### 5. Test the System
```bash
# Health check
curl http://localhost:3001/health

# Create a document
curl -X POST http://localhost:3001/documents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "What is RAG?",
    "content": "RAG (Retrieval-Augmented Generation) combines information retrieval with LLM generation...",
    "sourceType": "text"
  }'

# Search
curl -X POST http://localhost:3001/search \
  -H "Content-Type: application/json" \
  -d '{"query": "explain RAG", "limit": 5}'
```

---

## 🎯 RAG Pipeline Explained

### 1. Document Ingestion

**Chunking Strategy** (`rag-api/src/documents/chunking.service.ts:30`)
```typescript
- Chunk size: 512 characters
- Overlap: 50 characters (10%)
- Preserves context across chunks
- Handles sentence boundaries
```

**Embedding Generation** (`rag-api/src/documents/embedding.service.ts`)
```typescript
- Provider: Google Gemini (free tier)
- Model: gemini-embedding-001
- Dimensions: 768 (optimized for pgvector)
- Cache: LRU (256 entries)
```

### 2. Vector Search

**Similarity Search** (`rag-api/src/search/search.service.ts:38`)
```typescript
- Algorithm: Cosine similarity
- Index: pgvector HNSW
- Query: Embedded with same model
- Results: Top-K ranked chunks
```

### 3. Context Generation

**RAG Augmentation** (`rag-api/src/search/search.service.ts:88`)
```typescript
- Retrieval: Top 5 similar chunks
- Context assembly: Ranked by similarity
- Source tracking: Document + chunk references
- LLM: Ollama Cloud (kimi-k2.5)
```

---

## 📚 API Documentation

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

#### RAG Query
```http
POST /search/rag
Content-Type: application/json

{
  "query": "Explain RAG architecture",
  "limit": 5
}
```

#### Conversational Chat
```http
POST /search/converse
Content-Type: application/json

{
  "message": "Tell me more about embeddings",
  "conversationHistory": [...]
}
```

---

## 🌍 Deployment

### Supported Platforms

#### Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

**Environment Variables:**
- `GOOGLE_API_KEY`
- `OLLAMA_API_KEY`
- `OLLAMA_URL=https://ollama.com`
- `DATABASE_URL` (auto-provided by Railway PostgreSQL)

#### Render
1. Connect GitHub repository
2. Create PostgreSQL database
3. Deploy backend as Web Service
4. Deploy frontend as Static Site
5. Add environment variables

#### Vercel (Frontend only)
```bash
cd rag-ui
vercel --prod
```

### Cloud-Ready Features
- ✅ No local GPU required
- ✅ Stateless API design
- ✅ Connection pooling
- ✅ Health checks
- ✅ Graceful shutdown

---

## 📁 Project Structure

```
from-zero-rag/
├── rag-api/                    # Backend API
│   ├── src/
│   │   ├── documents/          # Document ingestion
│   │   │   ├── chunking.service.ts    # Text splitting
│   │   │   ├── embedding.service.ts   # Multi-provider embeddings
│   │   │   └── documents.service.ts   # Orchestration
│   │   ├── search/             # RAG & Search
│   │   │   ├── search.service.ts      # Vector search + RAG
│   │   │   └── search.controller.ts   # API endpoints
│   │   ├── agent/              # Conversational AI
│   │   ├── admin/              # Analytics
│   │   └── ollama/             # Ollama integration
│   ├── prisma/                 # Database schema
│   │   └── schema.prisma       # pgvector setup
│   └── Dockerfile              # Production image
│
├── rag-ui/                     # Frontend
│   ├── components/             # Vue components
│   ├── pages/                  # Application pages
│   ├── stores/                 # Pinia state
│   └── nuxt.config.ts          # Nuxt configuration
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md         # Technical architecture
│   └── DEPLOYMENT.md           # Deployment guide
│
├── docker-compose.yml          # Local development
└── .env                        # Configuration
```

---

## 📖 Learning Resources

### What You'll Learn

#### RAG Fundamentals
- ✅ Document chunking strategies
- ✅ Embedding generation and caching
- ✅ Vector similarity search
- ✅ Context retrieval and ranking
- ✅ LLM integration and prompting

#### Vector Databases
- ✅ pgvector setup and configuration
- ✅ HNSW indexing for performance
- ✅ Cosine similarity computation
- ✅ Efficient batch operations

#### Production Best Practices
- ✅ Multi-provider architecture
- ✅ Error handling and retries
- ✅ Caching strategies
- ✅ Docker multi-stage builds
- ✅ Cloud deployment

### Recommended Next Steps

1. **Hybrid Search** - Combine vector + keyword search
2. **Reranking** - Add cross-encoder reranking
3. **Evaluation** - Implement RAGAS metrics
4. **Fine-tuning** - Custom embedding models
5. **GraphRAG** - Knowledge graph integration

---

## 🤝 Contributing

This is an educational project. Feel free to:
- Fork and experiment
- Report issues
- Suggest improvements
- Share your learnings

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

---

## 👤 Author

**Alberto González**
- Full Stack Developer
- RAG & AI enthusiast

---

## 🙏 Acknowledgments

- Built with ❤️ to learn RAG architecture
- Inspired by LangChain and LlamaIndex
- Thanks to the open-source community

---

## 📊 Project Stats

- **Lines of Code**: ~5,000
- **Files**: 50+
- **Technologies**: 15+
- **Learning Time**: Perfect for weekend learning
- **Production Ready**: ✅ Yes

---

**⭐ If this helped you learn RAG, please star the repository!**
