# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| `main`  | Yes       |

## Reporting a vulnerability

If you discover a security issue, please **do not** open a public GitHub issue.

1. Email the maintainer with a description and reproduction steps (see repository owner on GitHub).
2. Allow up to **7 business days** for an initial response.
3. We will coordinate disclosure and a fix release when appropriate.

## Security practices in this project

- Session auth via **better-auth**; admin routes require `role === 'admin'` or `ADMIN_API_KEY`.
- User API keys stored with **AES-256-GCM** in `UserSetting`; global secrets in `Setting` use the same encryption.
- Production startup validates required env vars (`server/utils/env-validation.ts`).
- Rate limits on chat, upload, and search endpoints (optional `REDIS_URL` for multi-instance).
- Run `pnpm audit` in CI; keep dependencies updated via Dependabot.

## Deployment checklist

- Set strong `BETTER_AUTH_SECRET` (`openssl rand -hex 32`).
- Never commit `.env`; use `.env.example` as a template only.
- Expose only ports 80/443 (Caddy) in production; keep PostgreSQL and Ollama on the internal Docker network.
- Restrict `POST /api/search/inspect` to authenticated users (enforced in application code).
