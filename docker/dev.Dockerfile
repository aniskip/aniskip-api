# Install dev dependencies stage
FROM node:12-alpine as install_dev

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

# Run stage
FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json tsconfig.json ./
COPY src ./src
COPY --from=install_dev /usr/src/app/node_modules ./node_modules

CMD ["yarn", "dev"]
