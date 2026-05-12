# Docker Profiles Smoke Checklist

Use this checklist to validate all dockerized runtime surfaces after infrastructure changes.

## Profiles

- `full`: postgres + ollama + backend + frontend
- `api`: postgres + ollama + backend
- `learning`: playground

## Commands

From repo root:

- Full stack: `docker compose --profile full up --build -d`
- API standalone: `docker compose --profile api up --build -d`
- Learning playground: `docker compose --profile learning up --build -d`
- Stop one profile: `docker compose --profile <profile> down`

## Smoke Assertions

### full

- `GET http://localhost:3001/health` returns `status: ok`
- Frontend opens at `http://localhost:3000`
- Upload/search pages load without runtime errors

### api

- `GET http://localhost:3001/health` returns `status: ok`
- `/search` and `/documents` endpoints respond

### learning

- Playground opens at `http://localhost:3002`
- Onboarding page loads and generates `.env` preview
- Level/challenge pages render correctly
