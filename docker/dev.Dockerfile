FROM oven/bun:1.4.4-alpine

WORKDIR /usr/src/app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --ignore-scripts

COPY tsconfig.json ./
COPY deps/anime-relations/anime-relations.txt ./deps/anime-relations/anime-relations.txt
COPY src ./src

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["bun", "run", "dev"]
