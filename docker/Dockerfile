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
# The container keeps serving on 5000 so existing compose files keep working.
ENV PORT=5000

COPY --from=install /usr/src/app/node_modules ./node_modules
COPY package.json tsconfig.json ./
COPY deps/anime-relations/anime-relations.txt ./deps/anime-relations/anime-relations.txt
COPY src ./src

USER bun

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["bun", "src/main.ts"]
