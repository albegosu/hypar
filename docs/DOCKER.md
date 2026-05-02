# Docker Deployment Guide

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Nuxt 3 App    │────▶│  PostgreSQL 16   │     │     Ollama      │
│  (app, :3000)   │     │  + pgvector      │     │  (optional,     │
│  UI + API       │     │  (postgres,:5432)│     │   :11434)       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

Everything in one container — no separate frontend/backend split.

---

## Quick Start

### 1. Configure

```bash
cp .env.docker .env
# Edit .env — set GOOGLE_API_KEY (or OLLAMA_API_KEY+OLLAMA_URL) at minimum
# Template sets COMPOSE_PROFILES=full so `docker compose up -d --build` starts app + postgres + ollama.
```

### 2. Start

```bash
# App + database + local Ollama
docker compose --profile full up -d --build

# App + database only (omit Ollama; use cloud Ollama/Google/OpenAI)
docker compose --profile full up -d --build app postgres
```

### 3. Access

| Service | URL |
|---|---|
| App (UI + API) | http://localhost:3000 |
| PostgreSQL | localhost:5432 |
| Ollama (if running) | http://localhost:11434 |

---

## Profiles

| Profile | Services started |
|---|---|
| `full` | postgres + ollama + app |
| `api` | postgres + ollama (no app) |
| `all` | same as `full` |

```bash
docker compose --profile full up -d --build
docker compose --profile full down
docker compose --profile full down -v   # ⚠️ deletes volumes
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | 3000 | App port |
| `DATABASE_URL` | — | Full Postgres connection string |
| `POSTGRES_USER` | rag | DB user |
| `POSTGRES_PASSWORD` | rag_password | DB password |
| `POSTGRES_DB` | rag_db | DB name |
| `POSTGRES_PORT` | 5432 | Postgres port |
| `GOOGLE_API_KEY` | — | Embedding provider (free, recommended) |
| `OPENAI_API_KEY` | — | Embedding fallback |
| `OLLAMA_URL` | http://ollama:11434 | Ollama endpoint |
| `OLLAMA_API_KEY` | — | Ollama Cloud auth |
| `OLLAMA_MODEL` | nomic-embed-text | Embedding model |
| `OLLAMA_LLM_MODEL` | tinyllama | Chat model |
| `OLLAMA_CHAT_TIMEOUT_MS` | 180000 | LLM response timeout |
| `OLLAMA_PLANNER_TIMEOUT_MS` | 60000 | Planner timeout |
| `EMBEDDING_DIMENSIONS` | 768 | Must match pgvector column |
| `MEMORY_SCOPE` | local_per_user | `local_per_user` / `global` / `disabled` |
| `MEMORY_PROACTIVE` | true | Auto-save user facts |

---

## Useful Commands

```bash
# Logs
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f ollama

# Shell access
docker compose exec app sh
docker compose exec postgres psql -U rag -d rag_db

# Rebuild after code changes
docker compose --profile full up -d --build

# Pull latest Ollama model manually
docker compose exec ollama ollama pull nomic-embed-text
```

---

## Data Volumes

| Volume | Contents |
|---|---|
| `postgres_data` | PostgreSQL data files |
| `ollama_data` | Downloaded Ollama models |

---

## First Run

On first start, the Ollama container downloads the configured models — this can take a few minutes. Watch progress with:

```bash
docker compose logs -f ollama
```

---

## Troubleshooting

**App can't reach database:**
```bash
docker compose exec postgres pg_isready -U rag
docker compose logs postgres
```

**Port already in use:**
Change `PORT` or `POSTGRES_PORT` in `.env`.

**Rebuild from scratch:**
```bash
docker compose --profile full down -v
docker system prune -a
docker compose --profile full up -d --build
```

---

## Production Notes

- Change all default passwords in `.env` before deploying
- Use a managed PostgreSQL service (Railway, Supabase, Neon) instead of the Docker container in production
- The app runs `prisma migrate deploy` automatically on startup via `docker-entrypoint.sh`
- Add a reverse proxy (nginx, Caddy) in front for HTTPS

**Backup database:**
```bash
docker compose exec postgres pg_dump -U rag rag_db > backup_$(date +%Y%m%d).sql
```
