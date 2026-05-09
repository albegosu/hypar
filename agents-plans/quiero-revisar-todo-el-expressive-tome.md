# Plan — RAG a producción

## Contexto

El MVP ya tiene chunking por tokens, MMR, conversaciones persistentes, rate-limit y tests unitarios. Lo que falta para llevarlo a producción es: resolver la migración fallida, corregir la propiedad de documentos (cualquier userId puede ver/borrar docs ajenos), limpiar secretos del repo, añadir TLS + reverse proxy, mejorar la calidad del RAG con búsqueda híbrida e HyDE, añadir un health endpoint, y documentar el cambio de modelo (tinyllama no soporta tool calling).

Sin auth de usuario por ahora: el sistema sigue siendo localStorage-UUID, pero se endurecen las invariantes de ownership a nivel de servicio para cuando auth real llegue.

---

## Fase 0 — Migración fallida (BLOQUEANTE)

**Problema:** `20260503120000_robustify_mvp` marcada como fallida en `_prisma_migrations`. Causa probable: `ALTER TABLE "Chunk" ALTER COLUMN embedding SET NOT NULL` falla si existen chunks con embedding NULL que el DELETE previo no eliminó, o si la columna ya tenía otras constraints.

**Fix inmediato (ya ejecutar manualmente):**
```bash
docker compose exec app npx prisma migrate resolve --rolled-back "20260503120000_robustify_mvp"
```

**Luego reescribir la migración para que sea completamente idempotente y robusta:**

Archivo: `prisma/migrations/20260503120000_robustify_mvp/migration.sql`

Cambios:
1. Envolver `ALTER COLUMN embedding SET NOT NULL` en un bloque `DO $$ ... $$` que lo salte si ya es NOT NULL.
2. Añadir `IF NOT EXISTS` a todos los `ALTER TABLE ... ADD COLUMN` (ya los tiene, revisar).
3. Añadir `DROP TABLE IF EXISTS ... CASCADE` antes de los `CREATE TABLE` → NO, usar `CREATE TABLE IF NOT EXISTS` (ya lo tiene).
4. El problema real: la sentencia `ALTER TABLE "Chunk" ALTER COLUMN embedding SET NOT NULL` no tiene guarda. Reemplazarla por:
```sql
DO $$ BEGIN
  IF (SELECT is_nullable FROM information_schema.columns
      WHERE table_name='Chunk' AND column_name='embedding') = 'YES'
  THEN
    ALTER TABLE "Chunk" ALTER COLUMN embedding SET NOT NULL;
  END IF;
END $$;
```

Tras reescribir la migración: `docker compose exec app npx prisma migrate deploy`

---

## Fase 1 — Propiedad de documentos (seguridad crítica)

**Problema:** `GET /api/documents` devuelve todos los documentos de todos los usuarios. `DELETE /api/documents/[id]` no verifica ownership.

**Archivos a tocar:**
- `server/utils/documents.service.ts` — `findAll()`, `findOne()`, `removeDocument()`
- `server/api/documents/index.get.ts` — leer userId del header `x-user-id`
- `server/api/documents/[id].delete.ts` — pasar userId al servicio
- `server/api/documents/[id].get.ts` — (verificar si expone chunks de otros usuarios)

**Cambios:**

`documents.service.ts`:
```typescript
// findAll: filtrar por userId (o devolver solo sin-owner si userId vacío)
export async function findAll(userId?: string) {
  const where = userId?.trim()
    ? { OR: [{ userId: userId.trim() }, { userId: null }] }
    : { userId: null }
  return prisma.document.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { chunks: true } } },
  })
}

// removeDocument: verificar ownership
export async function removeDocument(documentId: string, userId?: string): Promise<void> {
  const doc = await prisma.document.findUnique({ where: { id: documentId }, select: { id: true, userId: true } })
  if (!doc) throw notFound('Document not found')
  if (doc.userId && userId?.trim() && doc.userId !== userId.trim()) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  await prisma.document.delete({ where: { id: documentId } })
}
```

`server/api/documents/index.get.ts`:
```typescript
export default defineEventHandler(async (event) => {
  const userId = getHeader(event, 'x-user-id') || getQuery(event).userId as string
  return findAll(userId)
})
```

`server/api/documents/[id].delete.ts`:
```typescript
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const userId = getHeader(event, 'x-user-id') || getQuery(event).userId as string
  await removeDocument(id, userId)
  setResponseStatus(event, 204)
})
```

---

## Fase 2 — Secretos e infraestructura de producción

### 2a. Limpiar secretos del repositorio

**Archivos:**
- `.env` — contiene claves reales de Google y Ollama. Reemplazar por `.env.example` con placeholders.
- `.gitignore` — verificar que `.env` y `.env.docker` estén ignorados.

`.env.example`:
```env
# PostgreSQL
POSTGRES_USER=rag
POSTGRES_PASSWORD=CHANGE_ME
POSTGRES_DB=rag_db

# Ollama (local) — recomendado cambiar a llama3.1:8b para tool calling
OLLAMA_URL=http://ollama:11434
OLLAMA_MODEL=nomic-embed-text
OLLAMA_LLM_MODEL=llama3.1:8b   # ← CAMBIO CRÍTICO (tinyllama no soporta tools)
EMBEDDING_DIMENSIONS=768

# Providers externos (opcional; si se configura, tienen precedencia sobre Ollama)
GOOGLE_API_KEY=
OPENAI_API_KEY=

# Admin API
ADMIN_API_KEY=CHANGE_ME_RANDOM_SECRET

# Memoria
MEMORY_SCOPE=local_per_user
```

### 2b. docker-compose.prod.yml con Caddy (TLS automático)

Archivo nuevo: `docker-compose.prod.yml`

```yaml
services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports: ["80:80", "443:443", "443:443/udp"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    networks: [rag-network]
    depends_on: [app]

  app:
    build: { context: ., dockerfile: Dockerfile }
    restart: unless-stopped
    env_file: [.env]
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      # ... resto igual que docker-compose.yml pero SIN exponer puerto 3000 al host
    expose: ["3000"]         # solo accesible dentro de la red Docker
    depends_on:
      postgres: { condition: service_healthy }
    networks: [rag-network]

  postgres:
    image: pgvector/pgvector:pg16
    restart: unless-stopped
    env_file: [.env]
    volumes: [postgres_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      retries: 10
    networks: [rag-network]
    # SIN ports: — no expuesto al host en prod

  ollama:
    image: ollama/ollama:latest
    restart: unless-stopped
    volumes: [ollama_data:/root/.ollama]
    expose: ["11434"]
    networks: [rag-network]

volumes: [postgres_data, ollama_data, caddy_data, caddy_config]
networks:
  rag-network: { driver: bridge }
```

Archivo nuevo: `Caddyfile`
```
{$DOMAIN} {
  reverse_proxy app:3000
  encode gzip
  header {
    Strict-Transport-Security "max-age=31536000; includeSubDomains"
    X-Frame-Options "DENY"
    X-Content-Type-Options "nosniff"
    Referrer-Policy "strict-origin-when-cross-origin"
  }
}
```

Variable de entorno `DOMAIN=rag.tudominio.com` en `.env`.

### 2c. Añadir ADMIN_API_KEY al docker-compose.yml actual

Añadir a `docker-compose.yml` en `app.environment`:
```yaml
ADMIN_API_KEY: ${ADMIN_API_KEY:-}
NUXT_ADMIN_API_KEY: ${ADMIN_API_KEY:-}
```

---

## Fase 3 — Calidad del RAG

### 3a. Cambiar modelo LLM por defecto

**Problema crítico:** `tinyllama` (1.1B) no es capaz de ejecutar tool calling con la Vercel AI SDK. El agente nunca llama a `searchKnowledgeBase` y el RAG es decorativo.

**Fix:** Cambiar el default en `docker-compose.yml` y `nuxt.config.ts`:
```
OLLAMA_LLM_MODEL=llama3.1:8b    # tool calling fiable
# o bien:
OLLAMA_LLM_MODEL=qwen2.5:7b-instruct  # alternativa rápida
```

También añadir en `docker-compose.yml` el pull del nuevo modelo en el entrypoint de Ollama.

### 3b. Búsqueda híbrida (vector + BM25 full-text)

**Motivación:** La búsqueda semántica falla con términos exactos (nombres propios, códigos, números). El full-text de PostgreSQL cubre este gap.

**Archivos a tocar:**
- `prisma/migrations/NUEVA/migration.sql` — añadir columna tsvector + índice GIN
- `server/utils/search.service.ts` — combinar scores en la query SQL

**Migración:**
```sql
-- Nueva migración: 20260504000000_hybrid_search.sql
ALTER TABLE "Chunk" ADD COLUMN IF NOT EXISTS textsearch tsvector
  GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;
CREATE INDEX IF NOT EXISTS "Chunk_textsearch_gin_idx"
  ON "Chunk" USING gin(textsearch);
```

> Nota: si los documentos son en español, usar `'spanish'` en lugar de `'english'`, o `'simple'` para multiling̈üe.

**`search.service.ts`** — reemplazar la query SQL de `search()`:
```typescript
// Parámetro nuevo en SearchOptions:
hybridAlpha?: number  // peso del vector (0-1). Default 0.7 → 70% vector, 30% BM25

// En la query SQL:
const alpha = options.hybridAlpha ?? 0.7
const rows = await prisma.$queryRaw<...>(Prisma.sql`
  WITH vector_scores AS (
    SELECT
      c.id,
      1 - (c.embedding <=> ${embeddingString}::vector) AS vscore
    FROM "Chunk" c
    JOIN "Document" d ON c."documentId" = d.id
    ${where}
    ORDER BY vscore DESC
    LIMIT ${fetchLimit}
  ),
  bm25_scores AS (
    SELECT
      c.id,
      ts_rank_cd(c.textsearch, plainto_tsquery('english', ${safeQuery})) AS bscore
    FROM "Chunk" c
    JOIN "Document" d ON c."documentId" = d.id
    ${where}
    WHERE c.textsearch @@ plainto_tsquery('english', ${safeQuery})
    LIMIT ${fetchLimit}
  ),
  combined AS (
    SELECT
      COALESCE(v.id, b.id) AS id,
      ${alpha} * COALESCE(v.vscore, 0) + ${1 - alpha} * COALESCE(b.bscore, 0) AS score
    FROM vector_scores v
    FULL OUTER JOIN bm25_scores b ON v.id = b.id
  )
  SELECT
    c.id AS "chunkId",
    c.content,
    c."documentId",
    d.title AS "documentTitle",
    c."startChar",
    c."endChar",
    c.embedding::text AS "embeddingText",
    combined.score AS distance
  FROM combined
  JOIN "Chunk" c ON c.id = combined.id
  JOIN "Document" d ON c."documentId" = d.id
  ORDER BY combined.score DESC
  LIMIT ${fetchLimit}
`)
```

### 3c. HyDE — Hypothetical Document Embedding

**Motivación:** Para preguntas factuales, el embedding de la pregunta es muy diferente al de los documentos que la responden. HyDE genera un párrafo hipotético de respuesta y busca con ese embedding → mejora el recall ~15-30% en benchmarks.

**Archivo a tocar:** `server/utils/search.service.ts` — nueva función `expandQueryHyDE()` y opción en `SearchOptions`.

```typescript
// SearchOptions nuevo campo:
hyde?: boolean   // default false (opt-in para no añadir latencia a búsquedas simples)

// Nueva función:
async function expandQueryHyDE(query: string, model: LanguageModel): Promise<string> {
  const { text } = await generateText({
    model,
    prompt: `Write a short paragraph (2-3 sentences) that would directly answer the following question. Be factual and specific.\n\nQuestion: ${query}\n\nAnswer:`,
    maxTokens: 150,
  })
  return text.trim() || query
}

// En search(), antes de generateEmbedding:
const queryToEmbed = (options.hyde && model)
  ? await expandQueryHyDE(safeQuery, model)
  : safeQuery
const queryEmbedding = await generateEmbedding(queryToEmbed)
```

El modelo se pasa desde `agentStreamText` usando `getOllamaChatModel()`. HyDE se activa con `hyde: true` solo en el flujo del agente (no en búsquedas directas del inspector).

---

## Fase 4 — Observabilidad

### 4a. Health endpoint

Archivo nuevo: `server/api/health.get.ts`

```typescript
export default defineEventHandler(async () => {
  const checks = { db: false, embedding: false }
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.db = true
  } catch {}
  try {
    const { ollamaUrl, ollamaModel } = useRuntimeConfig()
    const res = await $fetch(`${ollamaUrl}/api/tags`, { timeout: 3000 })
    checks.embedding = true
  } catch {}

  const ok = checks.db  // embedding es opcional (puede usar Google/OpenAI)
  if (!ok) setResponseStatus(event, 503)
  return { status: ok ? 'ok' : 'degraded', checks, ts: new Date().toISOString() }
})
```

Añadir al `docker-compose.yml` en `app.healthcheck`:
```yaml
healthcheck:
  test: ["CMD-SHELL", "wget -qO- http://localhost:3000/api/health | grep -q 'ok'"]
  interval: 30s
  timeout: 5s
  retries: 3
  start_period: 60s
```

### 4b. CI con GitHub Actions

Archivo nuevo: `.github/workflows/ci.yml`

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t rag-app .
```

---

## Archivos críticos a modificar / crear

| Archivo | Acción | Fase |
|---|---|---|
| `prisma/migrations/20260503120000_robustify_mvp/migration.sql` | Reescribir ALTER COLUMN NOT NULL con guarda DO $$ | 0 |
| `server/utils/documents.service.ts` | `findAll(userId?)`, `removeDocument(id, userId?)` | 1 |
| `server/api/documents/index.get.ts` | Leer y pasar userId | 1 |
| `server/api/documents/[id].delete.ts` | Leer y pasar userId | 1 |
| `.env` → `.env.example` | Eliminar secretos reales, plantilla con placeholders | 2a |
| `.gitignore` | Asegurar que `.env` y `.env.docker` estén ignorados | 2a |
| `docker-compose.yml` | Añadir ADMIN_API_KEY; cambiar OLLAMA_LLM_MODEL default | 2c + 3a |
| `docker-compose.prod.yml` | NUEVO — Caddy + servicios sin puertos al host | 2b |
| `Caddyfile` | NUEVO — reverse proxy + headers de seguridad | 2b |
| `prisma/migrations/20260504000000_hybrid_search/migration.sql` | NUEVO — columna tsvector + índice GIN | 3b |
| `server/utils/search.service.ts` | Híbrido vector+BM25 + opción HyDE | 3b + 3c |
| `server/api/health.get.ts` | NUEVO — health check endpoint | 4a |
| `.github/workflows/ci.yml` | NUEVO — CI typecheck + test + docker build | 4b |

---

## Verificación end-to-end

1. `docker compose exec app npx prisma migrate resolve --rolled-back "20260503120000_robustify_mvp"` → fija la migración bloqueada.
2. Reescribir la migración y `docker compose up --build` → ver logs de migrate deploy con "1 migration applied".
3. `curl http://localhost:3000/api/health` → `{"status":"ok","checks":{"db":true,...}}`.
4. Subir un documento → solo aparece en `GET /api/documents` si se envía el mismo userId con header `x-user-id`.
5. Intentar `DELETE /api/documents/:id` con userId distinto → `403 Forbidden`.
6. Configurar `OLLAMA_LLM_MODEL=llama3.1:8b`, hacer una pregunta → el agente llama a `searchKnowledgeBase` (visible en UI como "KB Hit").
7. Búsqueda con término exacto (nombre propio, código) → con híbrida aparece en los resultados aunque el embedding lo puntuase bajo.
8. En prod: `docker compose -f docker-compose.prod.yml up -d` con `DOMAIN=rag.tudominio.com` → Caddy provisiona TLS automáticamente.
9. `GET /api/admin/stats` sin header → 401. Con `Authorization: Bearer $ADMIN_API_KEY` → 200.
10. Push a GitHub → CI corre typecheck + test (28 tests verdes) + docker build.
