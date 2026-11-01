# aniskip-api

API for the [Aniskip](https://github.com/aniskip/aniskip-extension) browser extension: opening and ending skip times, votes, and anime relation rules.

API documentation: [`https://api.aniskip.com/docs`](https://api.aniskip.com/docs) (OpenAPI document: [`/openapi.json`](https://api.aniskip.com/openapi.json))

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

1. Copy `.env.example` to `.env`. Bun loads it automatically, and the defaults match the local services.

   ```sh
   cp .env.example .env
   ```

1. Optionally, load real data: about 77,000 anonymised skip times from the [public dataset](https://github.com/aniskip/sanitize_db_dump), refreshed weekly from production. This starts Postgres and Redis if they aren't running:

   ```sh
   bun run db:seed
   ```

1. Run the API on your machine. This starts Postgres and Redis in Docker (bound to localhost), applies the database migrations, then reloads the API when `src/` changes:

   ```sh
   bun run dev
   ```

   The docs are at http://localhost:5100/docs.

### Commands

| Command                 | What it does                                            |
| ----------------------- | ------------------------------------------------------- |
| `bun run check`         | Lint and check formatting with Biome                    |
| `bun run check:fix`     | Fix lint and formatting issues where possible           |
| `bun run typecheck`     | Type-check with TypeScript                              |
| `bun run test`          | Run the tests (`bun test`) with coverage                |
| `bun run dev`           | Start the services, then run the API with `bun --watch` |
| `bun run services:up`   | Start Postgres and Redis, then migrate                  |
| `bun run services:down` | Stop Postgres and Redis                                 |
| `bun run db:migrate`    | Apply pending migrations                                |
| `bun run db:rollback`   | Roll back the latest migration                          |
| `bun run db:status`     | List applied and pending migrations                     |
| `bun run db:seed`       | Load the public dataset (`--force` replaces)            |
| `bun run db:new <name>` | Create a migration in `db/migrations`                   |

### Database migrations

Schema changes are SQL files in [`db/migrations`](db/migrations), applied in order by [dbmate](https://github.com/amacneil/dbmate), which records them in the `schema_migrations` table. Each file has a `-- migrate:up` and a `-- migrate:down` section. In production, the `migrate` service in [`docker-compose.yml`](docker/docker-compose.yml) applies new migrations before the API starts.

`CREATE INDEX CONCURRENTLY` must be the only statement in its migration, marked `transaction:false`, since Postgres runs a multi-statement migration as one transaction.

## Contributing

PRs are squash-merged, and the **PR title** becomes the commit on `main`. Titles must be [Conventional Commits](https://www.conventionalcommits.org), e.g. `fix: handle empty episode length` or `feat(votes): …`; a CI check enforces this.

CI runs Biome (`bun run check:ci`), type checks, tests and a Docker build on every PR. Run `bun run check:fix` before pushing if your editor doesn't format with Biome.

## Self-hosting

Images are published on [Docker Hub](https://hub.docker.com/u/lexesjan).

1. Clone this repository. The compose file mounts the migrations from [`db/migrations`](db/migrations).
1. Create `docker/.env`, based on [`docker/.env.example`](docker/.env.example).
1. Start the containers from the `docker` folder. Pending migrations are applied before the API starts:

   ```sh
   docker compose up -d
   ```

1. Add TLS with a reverse proxy such as `traefik` or `NGINX` ([NGINX config generator](https://www.digitalocean.com/community/tools/nginx)).
