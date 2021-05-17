# Install dependencies stage
FROM node:15-alpine as install

WORKDIR /usr/src/app

COPY .yarn ./.yarn
COPY package.json yarn.lock .pnp.js ./

RUN yarn set version berry
RUN yarn install

# Build stage
FROM node:15-alpine as build

WORKDIR /usr/src/app

COPY package.json tsconfig.json yarn.lock .pnp.js ./
COPY src ./src
COPY --from=install /usr/src/app/.yarn ./.yarn

RUN yarn set version berry
RUN yarn build

# Run stage
FROM node:15-alpine

WORKDIR /usr/src/app

COPY package.json .pnp.js ./
COPY deps/anime-relations/anime-relations.txt ./dist/deps/anime-relations/anime-relations.txt
COPY --from=build /usr/src/app/dist ./dist
COPY --from=install /usr/src/app/.yarn ./.yarn

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["yarn", "node", "dist/src/app.js"]
