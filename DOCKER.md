# Docker Deployment Guide

Complete Docker Compose setup for the From Zero RAG application.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Nuxt 3    │────▶│   NestJS     │────▶│  PostgreSQL     │
│  (Frontend) │     │   Backend    │     │  + pgvector     │
│   Port 3000 │     │   Port 3001  │     │   Port 5432     │
└─────────────┘     └──────────────┘     └─────────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    Ollama    │
                     │  (Embeddings)│
                     │   Port 11434 │
                     └──────────────┘
```

## Quick Start

### 1. Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB+ RAM (Ollama needs ~2GB)

### 2. Configure Environment

```bash
# Copy environment template
cp .env.docker .env

# Edit .env with your settings (optional)
nano .env
```

### 3. Build and Start

The `docker-compose.yml` uses **profiles** to group services:

| Profile | Services included |
|---------|-------------------|
| `all` | postgres, ollama, backend, frontend, playground |
| `full` | postgres, ollama, backend, frontend |
| `api` | postgres, ollama, backend (no UI) |
| `learning` | playground (standalone, no backend needed) |

```bash
# Everything (full stack + learning playground)
docker compose --profile all up -d --build

# Full stack (UI + API + Ollama + DB)
docker compose --profile full up -d --build

# API only (no frontend)
docker compose --profile api up -d --build

# Learning playground only
docker compose --profile learning up -d --build
```

### 4. Verify Services

```bash
# Check all containers are running
docker compose --profile full ps

# View logs
docker compose --profile full logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f ollama
```

### 5. Access Application

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Nuxt 3 UI |
| Backend API | http://localhost:3001 | NestJS API |
| Ollama | http://localhost:11434 | Embeddings service |

## Configuration

### Environment Variables (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | rag | Database user |
| `POSTGRES_PASSWORD` | rag_password | Database password |
| `POSTGRES_DB` | rag_db | Database name |
| `POSTGRES_PORT` | 5432 | PostgreSQL port |
| `OLLAMA_PORT` | 11434 | Ollama API port |
| `OLLAMA_MODEL` | nomic-embed-text | Embedding model |
| `OLLAMA_LLM_MODEL` | tinyllama | Optional LLM model |
| `BACKEND_PORT` | 3001 | NestJS API port |
| `FRONTEND_PORT` | 3000 | Nuxt 3 dev server port |
| `OPENAI_API_KEY` | - | Optional OpenAI fallback |

### Data Persistence

| Volume | Path | Description |
|----------|------|-------------|
| `postgres_data` | `/var/lib/postgresql/data` | Database files |
| `ollama_data` | `/root/.ollama` | Downloaded models |
| `backend_uploads` | `/app/uploads` | Uploaded documents |

## Commands

```bash
# Start full stack
docker compose --profile full up -d

# Stop services
docker compose --profile full down

# Stop and remove volumes (⚠️ deletes data)
docker compose --profile full down -v

# Rebuild after code changes
docker compose --profile full up -d --build

# View logs
docker compose logs -f [service]

# Execute commands in containers
# Backend
docker compose exec backend sh
# Frontend
docker compose exec frontend sh
# Database
docker compose exec postgres psql -U rag -d rag_db

# Scale backend (if needed)
docker compose --profile api up -d --scale backend=2
```

## First Run Setup

After starting, the Ollama container will automatically download the configured models. This may take a few minutes on first run.

Check Ollama status:
```bash
docker compose logs -f ollama
```

Wait for:
```
pulling nomic-embed-text...
success
```

## Troubleshooting

### Port Conflicts

If ports are already in use, change them in `.env`:
```env
POSTGRES_PORT=5433
OLLAMA_PORT=11435
BACKEND_PORT=3002
FRONTEND_PORT=3001
```

### Permission Issues

On Linux, you may need to fix volume permissions:
```bash
sudo chown -R 1000:1000 ./data
```

### Ollama Not Responding

Ollama needs time to download models on first run:
```bash
# Check if model is downloaded
curl http://localhost:11434/api/tags

# Pull manually if needed
curl -X POST http://localhost:11434/api/pull -d '{"name": "nomic-embed-text"}'
```

### Database Connection Failed

Wait for PostgreSQL to be ready:
```bash
# Check health
docker compose exec postgres pg_isready -U rag

# View logs
docker compose logs postgres
```

### Rebuild from Scratch

```bash
# Remove everything
docker compose --profile full down -v
docker system prune -a

# Rebuild
docker compose --profile full up -d --build
```

## Production Deployment

### Security Considerations

1. **Change default passwords** in `.env`
2. **Use Docker secrets** for sensitive data:
   ```yaml
   secrets:
     db_password:
       file: ./secrets/db_password.txt
   ```
3. **Enable HTTPS** with reverse proxy (nginx/traefik)
4. **Set up firewall** rules

### Performance Tuning

For production, add resource limits:
```yaml
services:
  ollama:
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 2G
```

### Backup Strategy

```bash
# Backup PostgreSQL
docker compose exec postgres pg_dump -U rag rag_db > backup.sql

# Restore
docker compose exec -T postgres psql -U rag rag_db < backup.sql
```

## Development Mode

For development with hot-reload, use the individual project READMEs instead of Docker Compose.

Or mount volumes for development:
```yaml
services:
  backend:
    volumes:
      - ./rag-api/src:/app/src:ro
      - ./rag-api/prisma:/app/prisma:ro
```

## Health Checks

All services include health checks:
- **PostgreSQL**: `pg_isready`
- **Ollama**: API `/api/tags`
- **Backend**: HTTP endpoint (add `/health` to API)
- **Frontend**: HTTP check

Check health:
```bash
docker compose --profile full ps
# Shows health status: (healthy) or (unhealthy)
```

## Updates

```bash
# Pull latest images
docker compose --profile full pull

# Rebuild with latest code
docker compose --profile full up -d --build

# Update Ollama models
docker compose exec ollama ollama pull nomic-embed-text
```

## Support

- Backend issues: Check `docker compose logs backend`
- Frontend issues: Check `docker compose logs frontend`
- Database issues: Check `docker compose logs postgres`
- AI/embedding issues: Check `docker compose logs ollama`

## License

Private - Alberto
