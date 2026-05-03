# Environment variables

The **canonical template** is `.env.example` at the repository root. After cloning:

```bash
cp .env.example .env
```

Edit `.env` for your machine; never commit real secrets.

- **Docker Compose:** defaults for Postgres and the app are set in `docker-compose.yml`; you typically only need embedding keys (`GOOGLE_API_KEY` or `OPENAI_API_KEY`) or Ollama settings. Optional: uncomment `COMPOSE_PROFILES=full` in `.env` so `docker compose up` starts the full stack without `--profile full` each time.
- **Local `pnpm dev`:** uncomment and set `DATABASE_URL`, `OLLAMA_URL` (often `http://localhost:11434`), and `WORKFLOW_LOCAL_DATA_DIR` as described in `.env.example`.

For a variable-by-variable table focused on containers, see [Docker guide — Environment variables](../DOCKER.md#environment-variables).
