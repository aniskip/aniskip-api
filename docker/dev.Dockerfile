# Install dependencies stage
FROM node:18-alpine as install

WORKDIR /usr/src/app

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install

# Run stage
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json tsconfig.json yarn.lock .yarnrc.yml ./
COPY deps/anime-relations/anime-relations.txt ./deps/anime-relations/anime-relations.txt
COPY src ./src
COPY --from=install /usr/src/app/.yarn ./.yarn
COPY --from=install /usr/src/app/node_modules ./node_modules

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["yarn", "dev"]
