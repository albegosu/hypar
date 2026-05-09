# Comparación: from-zero-rag vs platform-agent-main

## Contexto
Análisis comparativo entre el proyecto propio del usuario (`from-zero-rag`) y un repositorio interno (`platform-agent-main`). El objetivo es identificar diferencias, solapamientos y oportunidades de aprendizaje entre ambas arquitecturas RAG.

---

## Stack tecnológico

| Aspecto | from-zero-rag | platform-agent-main |
|---|---|---|
| **Lenguaje** | TypeScript (Node.js 20) | Python |
| **Framework** | Nuxt 3 + Nitro/h3 | FastAPI + Streamlit |
| **LLM** | Multi-provider: Claude, GPT, Mistral, Ollama (via Vercel AI SDK) | Solo OpenAI GPT-3.5/4 |
| **Embeddings** | Multi-provider: Gemini, OpenAI, Voyage, Ollama | Solo OpenAI ada-002 |
| **Vector DB** | PostgreSQL 16 + pgvector (HNSW) | ChromaDB |
| **ORM/DB** | Prisma 7 + pgvector | Sin ORM (ChromaDB directo) |
| **Búsqueda** | Híbrida: vector (70%) + BM25 ts_rank_cd (30%), MMR, HyDE | Solo vector similarity (k=5) |
| **Workflows** | Vercel Workflow SDK (durable, steps con retry) | Sin durable workflows |
| **Frontend** | Nuxt UI v3, Tailwind v4, Pinia, Monaco Editor | Streamlit |
| **Containerización** | Docker + Compose + docker-entrypoint | Docker + Compose + Kubernetes |
| **Testing** | Vitest + eval harness (MRR, hit-rate) | pytest (test_*.py) |
| **IaC** | No | Terraform (AWS ECR) |

---

## Interfaces de usuario

| Interface | from-zero-rag | platform-agent-main |
|---|---|---|
| Web chat | ✅ Nuxt UI integrado | ✅ Streamlit |
| REST API | ✅ h3/Nitro endpoints | ✅ FastAPI |
| Discord bot | ❌ No | ✅ Sí (discord.py) |
| Admin panel | ✅ /api/admin/* (stats, queries) | ❌ No |

---

## Pipeline RAG

### from-zero-rag
1. Upload: PDF/TXT/MD (validación MIME, 10 MB)
2. Workflow durable (Vercel SDK) con steps retryables
3. Chunking semántico con js-tiktoken (~400 tokens, 60 overlap)
4. Embedding multi-provider con LRU cache de 256 entradas
5. Persist en pgvector (transacción Prisma)
6. Búsqueda híbrida: pgvector HNSW + BM25, MMR re-ranking, HyDE opcional

### platform-agent-main
1. Scraping: webs (BeautifulSoup) + repos GitHub (público/privado)
2. Chunking con LangChain RecursiveCharacterTextSplitter (1000 tokens, 200 overlap)
3. Embedding con OpenAI ada-002
4. Persist en ChromaDB (colección "dash_docs")
5. Búsqueda por similitud vectorial simple (top-k=5)

---

## Diferencias clave

### Ventajas de from-zero-rag
- **Búsqueda mucho más sofisticada**: híbrida (vector+BM25) + HyDE + MMR, con umbrales de score
- **Durabilidad**: Vercel Workflow SDK garantiza que cada step de ingesta sobrevive fallos
- **Multi-provider LLM/embedding**: el usuario puede cambiar de Claude a GPT a Mistral con un env var
- **Persistencia relacional**: schema completo con Conversations, Messages, Queries para analytics
- **Rate limiting**: token-bucket por (IP+userId) para chat, upload y documentos
- **Eval harness**: métricas MRR, hit-rate, p50/p95 latency sobre golden dataset
- **Learning Quest**: módulo educativo interactivo (Monaco Editor, XP, badges)
- **Memorias de conversación**: comandos /remember, /forget integrados en el chat

### Ventajas de platform-agent-main
- **Multi-interfaz out-of-the-box**: REST + Web + Discord desde el mismo contenedor
- **Scraping de fuentes**: puede ingestar documentación web y repos GitHub directamente
- **Perfiles de personalidad**: 3 modos del agente (support, documentation_master, hybrid)
- **Kubernetes-ready**: manifests, HPA, RBAC, Network Policies, PVC, Prometheus
- **Terraform para AWS ECR**: CI/CD listo para push a ECR con OIDC
- **Rate limiting de GitHub API**: backoff exponencial, detección de reset, colas

### Diferencias arquitectónicas importantes
- from-zero-rag usa **PostgreSQL** como única base de datos (relacional + vector), simplificando el stack. platform-agent-main usa **ChromaDB** exclusivamente para vectors, sin persistencia relacional.
- from-zero-rag tiene **ingestión durable** (Workflow SDK); platform-agent-main hace ingesta síncrona sin retry automático.
- platform-agent-main tiene **bot de Discord** y **scraping de URLs externas** que from-zero-rag no tiene.
- from-zero-rag tiene **analytics** (tabla Query con latencyMs, toolCalled) que platform-agent-main no tiene.

---

## Oportunidades de mejora para from-zero-rag

1. **Scraping de URLs**: platform-agent-main puede ingestar documentación web directamente. from-zero-rag solo acepta uploads manuales.
2. **Discord bot**: canal de soporte vía Discord sería trivial de añadir dado que ya existe el API.
3. **Perfiles de agente**: los 3 modos de platform-agent-main (support/docs/hybrid) son una idea interesante para la UI.
4. **Kubernetes manifests**: si se necesita escalar más allá de Docker Compose.

## Oportunidades de mejora para platform-agent-main

1. **Búsqueda híbrida**: pasar de similitud vectorial simple a vector+BM25+MMR mejoraría recall y precision significativamente.
2. **Multi-provider**: depender solo de OpenAI crea vendor lock-in; from-zero-rag demuestra cómo abstraerlo.
3. **Durable workflows**: la ingesta síncrona de platform-agent-main no tiene retry automático si falla en mitad del proceso.
4. **Analytics**: sin tabla Query no hay visibilidad sobre qué buscan los usuarios ni métricas de latencia.
5. **Eval harness**: no hay forma sistemática de medir calidad del RAG (MRR, hit-rate).

---

## Conclusión

from-zero-rag es técnicamente más avanzado en la capa RAG (búsqueda híbrida, durabilidad, multi-provider, analytics) mientras que platform-agent-main es más completo en distribución de interfaces (Discord, scraping, Kubernetes). Son proyectos complementarios con diferentes audiencias objetivo.
