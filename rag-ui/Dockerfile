# Multi-stage build for Nuxt 3

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
# Baked into client bundle; override at build time if BACKEND_PORT ≠ 3001
ARG NUXT_PUBLIC_API_BASE_URL=http://localhost:3001
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

LABEL org.opencontainers.image.title="from-zero-rag frontend" \
      org.opencontainers.image.description="Nuxt 3 UI — chat interface, document management and RAG search for from-zero-rag" \
      org.opencontainers.image.source="https://github.com/albegosu/from-zero-rag" \
      org.opencontainers.image.licenses="MIT"

ENV NODE_ENV=production

# Copy built files
COPY --from=builder /app/.output ./.output

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", ".output/server/index.mjs"]
