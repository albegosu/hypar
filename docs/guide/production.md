# Production Deployment

For production use `docker-compose.prod.yml`. It adds:

- **Caddy** as a reverse proxy with automatic TLS via Let's Encrypt
- **Security headers** — HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- PostgreSQL and Ollama are **not exposed to the host** — only reachable inside the Docker network
- App healthcheck (`GET /api/health`) wired to Docker restart policy

---

## Requirements

1. A server with Docker and Docker Compose
2. A domain name pointing to your server (A record)
3. Ports **80** and **443** open on your firewall

---

## Step by step

### 1. Configure `.env`

```bash
cp .env.example .env
```

Edit `.env` and fill in **all** `CHANGE_ME` values:

```env
# PostgreSQL — use strong random values
POSTGRES_USER=rag
POSTGRES_PASSWORD=a_strong_random_password
POSTGRES_DB=rag_db

# Caddy — your public domain
DOMAIN=rag.yourdomain.com

# LLM — llama3.1:8b supports tool calling
OLLAMA_LLM_MODEL=llama3.1:8b

# Embeddings — Google is free, recommended
GOOGLE_API_KEY=your_google_api_key

# Admin API — protects /api/admin/* endpoints
ADMIN_API_KEY=a_different_random_secret
```

### 2. Start

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Caddy will automatically obtain a TLS certificate for your domain. The first start takes a couple of minutes while Caddy negotiates with Let's Encrypt and Ollama downloads its models.

### 3. Verify

```bash
# App is up and database is reachable
curl https://rag.yourdomain.com/api/health
# → {"status":"ok","checks":{"db":true,"embedding":true},"ts":"..."}

# Container health
docker compose -f docker-compose.prod.yml ps
```

---

## Architecture in production

```
Internet
   │  :443 / :80
   ▼
┌──────────┐
│  Caddy   │  Automatic TLS, gzip, security headers
└──────────┘
   │  :3000 (internal only)
   ▼
┌──────────┐   ┌──────────────┐   ┌────────┐
│   app    │──▶│  postgres    │   │ ollama │
└──────────┘   └──────────────┘   └────────┘
             No host ports          No host ports
```

---

## Logs

```bash
docker compose -f docker-compose.prod.yml logs -f app
docker compose -f docker-compose.prod.yml logs -f caddy
```

---

## Backup

```bash
# Dump the database to a local file
docker compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup_$(date +%Y%m%d).sql
```

---

## Update

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

Prisma migrations run automatically on startup.

---

## Using a managed database

To use a managed PostgreSQL service (Railway, Supabase, Neon) instead of the Docker container:

1. Remove the `postgres` service from `docker-compose.prod.yml`
2. Set `DATABASE_URL` in `.env` to the connection string provided by your service
3. The `app` service will migrate and connect on startup

---

## Customising Caddy

Edit `Caddyfile` to add rate limiting, basic auth, or a custom error page:

```
{$DOMAIN} {
  reverse_proxy app:3000
  encode gzip

  # Example: basic auth on admin endpoints
  # basicauth /api/admin/* {
  #   admin JDJhJDE0...
  # }
}
```

After editing, reload Caddy without restarting:

```bash
docker compose -f docker-compose.prod.yml exec caddy caddy reload --config /etc/caddy/Caddyfile
```
