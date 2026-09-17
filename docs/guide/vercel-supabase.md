<DocMicroLead />

# Vercel + Supabase

A free deployment that depends on no machine of yours: the app on Vercel Hobby, Postgres on a Supabase Free project of its own, the agent on Ollama Cloud, and two GitHub Actions workflows for migrations and keeping the database awake.

```
browser ──► Vercel (Nuxt, Node functions) ──► Supabase transaction pooler :6543 ──► Postgres
                       │                                   ▲
                       └──► Ollama Cloud                   │
GitHub Actions: migrate.yml (on merge) ───── session pooler :5432
                keep-alive.yml (daily) ───► GET /api/health (runs a query)
```

Why these limits work:

- **Duration.** Vercel Hobby functions run up to 300 s with fluid compute. An agent turn times out at `OLLAMA_CHAT_TIMEOUT_MS` (180 s by default), well inside it. Responses stream.
- **Connections.** Serverless functions go through Supabase's shared pooler in transaction mode (port 6543, IPv4). `@prisma/adapter-pg` uses unnamed statements, which that mode supports. The direct connection is IPv6-only on the free plan and Vercel can't reach it.
- **Pausing.** Supabase pauses a free project after 7 days without activity. The keep-alive workflow calls `/api/health` daily, which runs `SELECT 1`.
- **Prisma.** The client is built with the WASM query compiler: no native engine to ship.

## 1. Supabase

1. Create a **new project** just for hypar (a free organization allows two). Save the database password.
2. **Turn off the Data API** (*Project Settings → Data API*). hypar connects to Postgres directly and never uses it; left on, the tables in `public` are reachable over REST with the project's publishable key.
3. *Database → Settings → SSL Configuration*: turn on **Enforce SSL** and **download the certificate**.
4. From **Connect**, copy two connection strings:
   - **Transaction pooler** (port `6543`) → the app's `DATABASE_URL`.
   - **Session pooler** (port `5432`) → migrations.

## 2. Migrations (GitHub Actions)

In the hypar repository, add the secret used by `.github/workflows/migrate.yml`. Add `?sslmode=require` to the session pooler string:

```bash
gh secret set DATABASE_MIGRATION_URL -R <owner>/hypar
```

Then run **Actions → Migrate → Run workflow** once. After that it runs on its own whenever a migration reaches `main`. Vercel deploys in parallel, so keep migrations additive (new tables and nullable columns) and a new deployment never meets a missing column for long.

## 3. Vercel

1. **Add New → Project** and import the repository. Vercel detects Nuxt and pnpm; keep the defaults.
2. *Settings → Functions → Region*: pick the one closest to the Supabase project's region.
3. Environment variables (Production):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Transaction pooler string, **without** `sslmode` |
| `DATABASE_CA_CERT` | Contents of the Supabase certificate (PEM). The connection is encrypted and the server verified |
| `BETTER_AUTH_SECRET` | `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | The production URL, e.g. `https://hypar-xyz.vercel.app` (set it after the first deploy, then redeploy) |
| `LLM_PROVIDER` | `ollama-cloud` |
| `OLLAMA_URL` | `https://ollama.com` |
| `OLLAMA_API_KEY` | From [ollama.com/settings/keys](https://ollama.com/settings/keys) |
| `OLLAMA_LLM_MODEL` | A model your Ollama plan serves, e.g. `gemma4:31b` on the free plan |
| `DISABLE_SIGNUP` | Leave unset until your account exists (step 4) |

4. Deploy, set `BETTER_AUTH_URL` to the URL Vercel assigned and redeploy.

## 4. Close sign-up

Open the app, create your account, then set `DISABLE_SIGNUP=true` and redeploy. A public URL with open sign-up lets anyone spend your Ollama quota. Sign-in keeps working, and it also blocks new accounts through GitHub or Google OAuth if you configure them.

## 5. Keep the database awake

Set the repository **variable** (not a secret) that `.github/workflows/keep-alive.yml` pings:

```bash
gh variable set HYPAR_URL -R <owner>/hypar --body "https://hypar-xyz.vercel.app"
```

Run **Actions → Keep alive → Run workflow** once to check it: it fails if the database check fails. GitHub disables scheduled workflows after 60 days without commits; re-enable it from the Actions tab when the email arrives.

## Limits to know

- **In-memory rate limiting** is per function instance, so it is looser on Vercel than on a single server. Enough for a personal garden.
- **Preview deployments** share the production environment only if you add the variables to *Preview* too; sign-in there needs `BETTER_AUTH_URL` to match their URL. The simplest setup is Production only.
- Supabase Free gives 500 MB of database, far more than text embryos need.
