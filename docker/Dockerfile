# Install production dependencies stage
FROM oven/bun:1.4.4-alpine AS install

WORKDIR /usr/src/app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --production --ignore-scripts

# Run stage: Bun runs the TypeScript sources directly, no build step.
FROM oven/bun:1.4.4-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache tini

ENV NODE_ENV=production

COPY --from=install /usr/src/app/node_modules ./node_modules
COPY package.json tsconfig.json ./
COPY deps/anime-relations/anime-relations.txt ./deps/anime-relations/anime-relations.txt
COPY src ./src
COPY public ./public

USER bun

# Healthy once the API answers and can reach Postgres and Redis (see /health).
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --start-interval=2s --retries=3 \
  CMD wget -qO /dev/null "http://127.0.0.1:${PORT:-5100}/health" || exit 1

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["bun", "src/main.ts"]
