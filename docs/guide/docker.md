<DocMicroLead />

# Docker Guide

> For the full reference (all env vars, troubleshooting, production notes), see the [Docker Deployment Guide](/DOCKER).

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

## Profiles

| Profile | Services started |
|---|---|
| `full` | app + postgres + ollama |
| `api` | postgres + ollama (no app) |
| `all` | same as `full` |

```bash
# Start everything
docker compose --profile full up -d --build

# Stop
docker compose --profile full down

# Stop and delete volumes (⚠️ erases all data)
docker compose --profile full down -v
```

---

## Access

| Service | URL |
|---|---|
| App (UI + API) | http://localhost:3000 |
| PostgreSQL | localhost:5432 |
| Ollama (if running) | http://localhost:11434 |

---

## Useful commands

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

# Run a migration manually
docker compose exec app pnpm db:deploy

# Pull an Ollama model manually
docker compose exec ollama ollama pull llama3.1:8b
```

---

## Data volumes

| Volume | Contents |
|---|---|
| `postgres_data` | PostgreSQL data files |
| `ollama_data` | Downloaded Ollama models |
| `workflow_data` | Durable workflow state (ingestion) |

---

## First run

On first start, the Ollama container downloads the configured models. This can take several minutes depending on connection speed:

```bash
docker compose logs -f ollama
```

You will see `nomic-embed-text` and `llama3.1:8b` being pulled. The app is ready to use once both are downloaded.

---

## Health check

The app exposes `GET /api/health`:

```bash
curl http://localhost:3000/api/health
# {"status":"ok","checks":{"db":true,"embedding":true},"ts":"..."}
```

Docker Compose uses this endpoint to determine when the app container is healthy.

---

## Troubleshooting

**App cannot reach database:**
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

## Going to production?

The development `docker-compose.yml` exposes all ports to the host and is not hardened for production. Use [docker-compose.prod.yml](./production) instead — it adds Caddy for automatic TLS and keeps the database off the public network.
