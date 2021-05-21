# typescript-aniskip-api

API for Aniskip web browser extension

## Getting started

### API Documentation

The documentation for the API can be found at [`https://api.aniskip.com/v1/api-docs`](https://api.aniskip.com/v1/api-docs)

### Running the API

#### Prerequisites

You will need to have installed:

1. Docker

#### Deploying the API for production

The built images for this project can be found on [Docker Hub](https://hub.docker.com/u/lexesjan)

1. Create a `docker-compose.yml` file. An example one can be found [here](https://github.com/lexesjan/typescript-aniskip-api/blob/main/docker/docker-compose.yml)
1. Create a `.env` file in the same directory. An example one can be found [here](https://github.com/lexesjan/typescript-aniskip-api/blob/main/docker/.env_example)
1. Start the docker containers
   ```
   docker-compose up -d
   ```
1. Add TLS/SSL using a reverse proxy. You can use reverse proxy software like `traefik` or `NGINX`. You can easily create an `NGINX` config [here](https://www.digitalocean.com/community/tools/nginx)

#### Running the API for development
1. Clone the repo
   ```
   git clone https://github.com/lexesjan/typescript-aniskip-api
   ```
1. Navigate into the cloned GitHub repository
   ```
   cd typescript-aniskip-api
   ```
1. Copy `.env_example` in the docker folder to `./docker/.env` and change `POSTGRES_PASSWORD`
1. Run the start script
   ```
   ./docker/start.sh dev
   ```
