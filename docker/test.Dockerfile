# Install dependencies stage
FROM node:15-alpine as install

WORKDIR /usr/src/app

COPY .yarn ./.yarn
COPY package.json yarn.lock .pnp.js ./

RUN yarn set version berry
RUN yarn install

# Run stage
FROM node:15-alpine

WORKDIR /usr/src/app

COPY package.json tsconfig.json yarn.lock .pnp.js jest.config.js ./
COPY deps ./deps/anime-relations/anime-relations.txt
COPY src ./src
COPY test ./test
COPY --from=install /usr/src/app/.yarn ./.yarn

RUN yarn set version berry

CMD ["yarn", "test"]
