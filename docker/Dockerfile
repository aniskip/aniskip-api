# Install dev dependencies stage
FROM node:16-alpine as install-dev

WORKDIR /usr/src/app

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install

# Build stage
FROM node:16-alpine as build

WORKDIR /usr/src/app

COPY package.json tsconfig.json yarn.lock .yarnrc.yml ./
COPY src ./src
COPY --from=install-dev /usr/src/app/.yarn ./.yarn
COPY --from=install-dev /usr/src/app/node_modules ./node_modules

RUN yarn build

# Install prod dependencies stage
FROM node:16-alpine as install-prod

WORKDIR /usr/src/app

COPY package.json yarn.lock .yarnrc.yml ./
COPY --from=install-dev /usr/src/app/.yarn ./.yarn

RUN yarn workspaces focus --production

# Run stage
FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY deps/anime-relations/anime-relations.txt ./dist/deps/anime-relations/anime-relations.txt
COPY --from=build /usr/src/app/dist ./dist
COPY --from=install-prod /usr/src/app/node_modules ./node_modules

RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["yarn", "node", "dist/src/main.js"]
