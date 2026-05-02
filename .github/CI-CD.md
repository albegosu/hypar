# CI/CD

## GitHub Actions Workflows

| Workflow | File | Trigger | Purpose |
|---|---|---|---|
| **CI orchestration** | `ci.yml` | Push/PR → main, develop | Routes to backend/front/learning jobs by path filters |
| **Unified app check** | `test-backend.yml`, `test-frontend.yml`, `test-learning.yml` | Push/PR (path-scoped) | Install, Prisma migrations (where applicable), `pnpm build` |
| **Docker build** | `docker-build.yml` | Push to main/tags/PR | Build single root Dockerfile image |

> Adjust path filters if you add standalone packages later; currently everything lives in one Nuxt workspace.

---

## Local Verification

Before opening a PR, run these locally:

```bash
# Install dependencies
pnpm install

# Type check + build
pnpm build

# Database migrations (if schema changed)
pnpm db:migrate
```

---

## Docker Build

The Dockerfile uses a multi-stage build:

1. **deps** — `pnpm install --frozen-lockfile`
2. **builder** — `pnpm build` → `.output/`
3. **runner** — Node 20 Alpine, copies `.output/` + `prisma/`

Entrypoint: `docker-entrypoint.sh` runs `prisma migrate deploy` before starting the server.

Test locally:

```bash
docker build -t from-zero-rag:test .
docker run -p 3000:3000 --env-file .env from-zero-rag:test
```

---

## Deployment

### Docker Compose (self-hosted)

```bash
docker compose --profile full up -d --build
```

See [Docker guide](../docs/DOCKER.md) for the full guide.

### Railway / Render

1. Connect the GitHub repository
2. Add a PostgreSQL database (Railway provides one)
3. Set environment variables (see `.env.docker` for the full list)
4. Deploy — the entrypoint runs migrations automatically

**Required env vars for cloud:**
- `DATABASE_URL`
- `GOOGLE_API_KEY` or `OPENAI_API_KEY`
- `OLLAMA_URL` + `OLLAMA_API_KEY` (if using Ollama Cloud)
- `OLLAMA_LLM_MODEL`

---

## Required Secrets (for CI workflows)

| Secret | Workflow | Description |
|---|---|---|
| `SSH_PRIVATE_KEY` | deploy | SSH key for server access |
| `SSH_HOST` | deploy | Production server hostname |
| `SSH_USER` | deploy | SSH username |
| `ENV_FILE` | deploy | Production `.env` contents |

---

## Dependabot

Automatic dependency updates can be configured for weekly bumps:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
```
