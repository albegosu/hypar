# Contributing to From Zero RAG

Thanks for your interest in contributing! This is primarily a learning project, but improvements, bug fixes and ideas are welcome.

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [pnpm 10+](https://pnpm.io/) — `npm install -g pnpm`
- [Docker + Docker Compose](https://docs.docker.com/get-docker/)
- An Ollama instance or API key for Google/OpenAI embeddings

### Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/albegosu/from-zero-rag.git
cd from-zero-rag

# 2. Install dependencies (all workspace packages)
pnpm install

# 3. Start the backend services (DB + Ollama)
docker compose --profile api up -d

# 4. Set up environment for the API
# Edit apps/rag-api/.env with your settings
cp apps/rag-api/.env.example apps/rag-api/.env

# 5. Run database migrations
cd apps/rag-api && npx prisma migrate dev && cd ..

# 6. Start everything in dev mode
pnpm dev
```

## Project Structure

```
from-zero-rag/
├── apps/
│   ├── rag-api/          # NestJS backend (RAG pipeline, vector search)
│   └── rag-ui/           # Nuxt 3 frontend (chat, document management)
├── packages/
│   ├── rag-learning/     # Shared challenge/validator library
│   └── rag-playground/   # Interactive learning UI
└── docker-compose.yml    # Full stack orchestration
```

## Development Workflow

1. **Fork** the repository
2. **Create a branch** from `main`: `git checkout -b feat/your-feature`
3. **Make your changes** and add tests if applicable
4. **Run the checks** before pushing:

```bash
# Backend tests
cd apps/rag-api && pnpm test

# Backend lint
cd apps/rag-api && pnpm lint

# Learning package build
pnpm --filter @rag/learning build
```

5. **Open a pull request** against `main` — CI will run automatically

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/short-description` | `feat/streaming-responses` |
| Bug fix | `fix/short-description` | `fix/chunking-offset` |
| Docs | `docs/short-description` | `docs/api-endpoints` |
| Chore | `chore/short-description` | `chore/update-deps` |

## Commit Style

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add streaming support for chat responses
fix: correct chunk offset calculation for unicode text
docs: add deployment guide for Railway
chore: update pnpm lockfile
```

## What to Contribute

- **Bug fixes** — especially around chunking accuracy, embedding edge cases
- **New validators** for the learning playground challenges
- **Documentation** improvements and clarifications
- **Tests** — the backend test coverage can always grow
- **UI/UX** improvements for the chat or document management views

## Questions?

Open an [issue](https://github.com/albegosu/from-zero-rag/issues) with your question or idea before starting large changes — it helps align effort.
