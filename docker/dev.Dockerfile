# Install dependencies stage
FROM node:16-alpine as install

WORKDIR /usr/src/app

COPY .yarn ./.yarn
COPY package.json yarn.lock .pnp.js ./

RUN yarn set version berry
RUN yarn install

# Run stage
FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json tsconfig.json yarn.lock .pnp.js ./
COPY deps/anime-relations/anime-relations.txt ./deps/anime-relations/anime-relations.txt
COPY src ./src
COPY --from=install /usr/src/app/.yarn ./.yarn

RUN yarn set version berry

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["yarn", "dev"]
