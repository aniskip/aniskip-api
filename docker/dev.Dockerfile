# Install dev dependencies stage
FROM node:15-alpine as install_dev

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

# Run stage
FROM node:15-alpine

WORKDIR /usr/src/app

COPY package.json tsconfig.json jest.config.js ./
COPY src ./src
COPY test ./test
COPY --from=install_dev /usr/src/app/node_modules ./node_modules

CMD ["yarn", "dev"]
