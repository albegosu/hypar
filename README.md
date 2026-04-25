# PKM RAG - Personal Knowledge Management with RAG

A full-stack application for managing personal knowledge with AI-powered retrieval-augmented generation (RAG).

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Nuxt 3    │────▶│   NestJS     │────▶│  PostgreSQL     │
│  (Frontend) │     │   Backend    │     │  + pgvector     │
└─────────────┘     └──────────────┘     └─────────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    Ollama    │
                     │  (Embeddings) │
                     └──────────────┘
```

## 📁 Project Structure

```
.
├── rag-api/          # NestJS backend API
│   ├── src/              # Source code
│   ├── prisma/           # Database schema
│   ├── Dockerfile        # Production build
│   └── README.md         # Backend docs
├── rag-ui/           # Nuxt 3 frontend
│   ├── components/       # Vue components
│   ├── pages/            # Application pages
│   ├── stores/           # Pinia stores
│   ├── Dockerfile        # Production build
│   └── README.md         # Frontend docs
├── docker-compose.yml    # Docker orchestration
├── DOCKER.md            # Docker deployment guide
├── .env.docker          # Docker environment template
├── init-scripts/        # Database initialization
└── README.md            # This file
```

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB+ RAM

### 1. Clone and Configure

```bash
git clone <repo-url>
cd from-zero-rag

# Configure environment
cp .env.docker .env
# Edit .env if needed
```

### 2. Start All Services

```bash
# Build and start
docker-compose up -d --build

# Or pull pre-built images (if available)
docker-compose up -d
```

### 3. Access Application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Nuxt 3 UI |
| **Backend API** | http://localhost:3001 | NestJS API |
| **Ollama** | http://localhost:11434 | Embeddings service |

### 4. Verify

```bash
# Check all services are running
docker-compose ps

# View logs
docker-compose logs -f

# Test health endpoint
curl http://localhost:3001/health
```

## 🛠️ Development Mode

See individual READMEs for development without Docker:

- [Backend Development Guide](./rag-api/README.md)
- [Frontend Development Guide](./rag-ui/README.md)

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [DOCKER.md](./DOCKER.md) | Docker deployment guide |
| [Backend README](./rag-api/README.md) | NestJS API documentation |
| [Frontend README](./rag-ui/README.md) | Nuxt 3 UI documentation |

## ✨ Features

- **📱 Mobile-first design** - Bottom navigation, touch-friendly
- **🔍 Semantic search** - Natural language queries with vector similarity
- **🤖 RAG mode** - AI-powered responses with source citations
- **📄 Document upload** - Text, Markdown, PDF support
- **🌙 Dark mode** - Automatic theme switching
- **🐳 Docker deployment** - One-command full stack

## 🔧 Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Nuxt 3, Vue 3, Nuxt UI, Pinia, Tailwind CSS |
| Backend | NestJS, Prisma, PostgreSQL |
| Vector DB | pgvector (PostgreSQL extension) |
| Embeddings | Ollama (nomic-embed-text), OpenAI (optional) |
| AI | Local LLM via Ollama |

## 📝 Environment Variables

Create `.env` file from `.env.docker`:

```env
# PostgreSQL
POSTGRES_USER=pkm
POSTGRES_PASSWORD=pkm_password
POSTGRES_DB=pkm_rag

# Ollama
OLLAMA_MODEL=nomic-embed-text

# OpenAI (optional)
OPENAI_API_KEY=your_key_here

# Ports
FRONTEND_PORT=3000
BACKEND_PORT=3001
```

## 🐛 Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs [service]

# Rebuild
docker-compose down
docker-compose up -d --build
```

### Port conflicts

Change ports in `.env`:
```env
FRONTEND_PORT=3001
BACKEND_PORT=3002
POSTGRES_PORT=5433
```

See [DOCKER.md](./DOCKER.md) for complete troubleshooting guide.

## 📦 Commands Reference

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build

# Logs
docker-compose logs -f [backend|frontend|postgres|ollama]

# Reset (⚠️ deletes data)
docker-compose down -v

# Backup database
docker-compose exec postgres pg_dump -U pkm pkm_rag > backup.sql
```

## 🔮 Roadmap

- [ ] PDF parsing support
- [ ] Web page scraping
- [ ] Image OCR
- [ ] Tag system
- [ ] Related documents
- [ ] Backlinks graph
- [ ] Full-text search hybrid
- [ ] Export to various formats

## 👤 Author

Alberto - Full Stack Developer

## 📄 License

Private - All rights reserved
