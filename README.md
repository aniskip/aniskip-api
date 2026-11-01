# aniskip-api

API for the [Aniskip](https://github.com/aniskip/aniskip-extension) browser extension: opening and ending skip times, votes, and anime relation rules.

API documentation: [`https://api.aniskip.com/api-docs`](https://api.aniskip.com/api-docs)

## Development

### Prerequisites

- [Bun](https://bun.sh) 1.4.4
- [Docker](https://docs.docker.com/get-docker/) (for Postgres and Redis)

### Getting started

1. Clone the repo with its submodule (the anime relations data):

   ```sh
   git clone --recurse-submodules https://github.com/aniskip/aniskip-api
   cd aniskip-api
   ```
1. Install dependencies:

   ```sh
   bun install
   ```
1. Copy `docker/.env_example` to `docker/.env` and set `POSTGRES_PASSWORD`.
1. Start the API with Postgres and Redis. The API runs with `bun --watch` and reloads when `src/` changes:

   ```sh
   ./docker/start.sh dev
   ```

### Commands

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `bun run check`     | Lint and check formatting with Biome          |
| `bun run check:fix` | Fix lint and formatting issues where possible |
| `bun run typecheck` | Type-check with TypeScript                    |
| `bun run test`      | Run the tests (`bun test`) with coverage      |
| `bun run dev`       | Run the API on the host with `bun --watch`    |

## Contributing

PRs are squash-merged, and the **PR title** becomes the commit on `main`. Titles must be [Conventional Commits](https://www.conventionalcommits.org), e.g. `fix: handle empty episode length` or `feat(votes): …`; a CI check enforces this.

CI runs Biome (`bun run check:ci`), type checks, tests and a Docker build on every PR. Run `bun run check:fix` before pushing if your editor doesn't format with Biome.

## Self-hosting

Images are published on [Docker Hub](https://hub.docker.com/u/lexesjan).

1. Create a `docker-compose.yml`, based on [this one](docker/docker-compose.yml).
1. Create a `.env` file next to it, based on [`docker/.env_example`](docker/.env_example).
1. Start the containers:

   ```sh
   docker compose up -d
   ```
1. Add TLS with a reverse proxy such as `traefik` or `NGINX` ([NGINX config generator](https://www.digitalocean.com/community/tools/nginx)).
