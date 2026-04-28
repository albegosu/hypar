# Multi-stage build for the learning playground (Nuxt + workspace package)

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/rag-learning/package.json packages/rag-learning/package.json
COPY packages/rag-playground/package.json packages/rag-playground/package.json

RUN pnpm install --frozen-lockfile

FROM deps AS builder
COPY packages/rag-learning packages/rag-learning
COPY packages/rag-playground packages/rag-playground

RUN pnpm --filter @rag/learning build
RUN pnpm --filter @rag/playground build

FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable

COPY --from=builder /app ./

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3002

EXPOSE 3002

CMD ["sh", "-c", "cd /app/packages/rag-playground && node .output/server/index.mjs"]
