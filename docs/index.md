---
layout: home

hero:
  name: "fragua"
  text: "Production-ready RAG in a single Nuxt 3 app"
  tagline: Vector search, hybrid BM25, HyDE, agentic chat, durable ingestion — all wired up and ready to deploy.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/albegosu/from-zero-rag

features:
  - title: Hybrid Search
    icon: 🔍
    details: Combines pgvector cosine similarity with PostgreSQL BM25 full-text. Names, codes and numbers that embeddings miss are caught by keyword matching.
  - title: HyDE Query Expansion
    icon: 🧠
    details: Before embedding your query, the LLM generates a hypothetical answer and that gets embedded instead. Improves recall 15–30% for factual Q&A.
  - title: Agentic Chat
    icon: 💬
    details: Vercel AI SDK tool-calling. The model decides when to search the knowledge base and streams the answer token-by-token with inline citations.
  - title: Durable Ingestion
    icon: ⚙️
    details: Workflow SDK handles chunking → embedding → persist in independent retryable steps. Upload returns immediately; poll for completion.
  - title: Production-ready
    icon: 🚀
    details: docker-compose.prod.yml with Caddy for automatic TLS, HSTS, and security headers. Zero config — point a domain and go.
  - title: Learning Quest
    icon: 🎮
    details: 3 levels, 9 coding challenges, 650 XP. Build intuition for embeddings, chunking and vector databases by writing the code yourself.
---
