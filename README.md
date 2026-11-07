# aniskip-api

API for the [Aniskip](https://github.com/aniskip/aniskip-extension) browser extension: opening and ending skip times, votes, and anime relation rules.

API documentation: [`https://api.aniskip.com/docs`](https://api.aniskip.com/docs) (OpenAPI document: [`/openapi.json`](https://api.aniskip.com/openapi.json))

## Development

### Prerequisites

- [Vite+](https://viteplus.dev/guide/) (installs the Bun version pinned in `package.json`)
- [Docker](https://docs.docker.com/get-docker/) (for Postgres and Redis)

### Getting started

1. Clone the repo with its submodule (the anime relations data):

   ```sh
   git clone --recurse-submodules https://github.com/aniskip/aniskip-api
   cd aniskip-api
   ```

1. Install dependencies:

   ```sh
   vp install
   ```

1. Copy `.env.example` to `.env`. Bun loads it automatically, and the defaults match the local services.

   ```sh
   cp .env.example .env
   ```

1. Optionally, load real data: anonymised skip times from the [public dataset](https://github.com/aniskip/sanitize-db-dump), refreshed weekly from production. This starts Postgres and Redis if they aren't running:

   ```sh
   vp run db:seed
   ```

1. Run the API on your machine. This starts Postgres and Redis in Docker (bound to localhost), applies the database migrations, then reloads the API when `src/` changes:

   ```sh
   vp run dev
   ```

   The docs are at http://localhost:5100/docs.

### Commands

| Command                | What it does                                                            |
| ---------------------- | ----------------------------------------------------------------------- |
| `vp check`             | Check formatting, lint and types                                        |
| `vp check --fix`       | Fix formatting and lint issues where possible                           |
| `vp run test`          | Run the tests (`bun test`) with coverage. `vp test` runs Vitest instead |
| `vp run dev`           | Start the services, then run the API with `bun --watch`                 |
| `vp run services:up`   | Start Postgres and Redis, then migrate                                  |
| `vp run services:down` | Stop Postgres and Redis                                                 |
| `vp run db:migrate`    | Apply pending migrations                                                |
| `vp run db:rollback`   | Roll back the latest migration                                          |
| `vp run db:status`     | List applied and pending migrations                                     |
| `vp run db:seed`       | Load the public dataset (`--force` replaces)                            |
| `vp run db:new <name>` | Create a migration in `db/migrations`                                   |

### Database migrations

Schema changes are SQL files in [`db/migrations`](db/migrations), applied in order by [dbmate](https://github.com/amacneil/dbmate), which records them in the `schema_migrations` table. Each file has a `-- migrate:up` and a `-- migrate:down` section. In production, the `migrate` service in [`docker-compose.yml`](docker/docker-compose.yml) applies new migrations before the API starts.

To change the schema:

1. Create a migration file:

   ```sh
   vp run db:new add_some_column
   ```

1. Write the change under `-- migrate:up` and how to undo it under `-- migrate:down`.
1. Apply it with `vp run db:migrate`. To check the down section, run `vp run db:rollback` and then `vp run db:migrate` again.

## Contributing

PRs are squash-merged, and the **PR title** becomes the commit on `main`. Titles must be [Conventional Commits](https://www.conventionalcommits.org), e.g. `fix: handle empty episode length` or `feat(votes): …`; a CI check enforces this.

CI runs `vp check` (formatting, lint and type checks), the tests and a Docker build on every PR. Run `vp check --fix` before pushing if your editor doesn't format with Oxfmt.

## Self-hosting

Images are published on [Docker Hub](https://hub.docker.com/u/lexesjan).

1. Clone this repository. The compose file mounts the migrations from [`db/migrations`](db/migrations).
1. Create `docker/.env`, based on [`docker/.env.example`](docker/.env.example).
1. Start the containers from the `docker` folder. Pending migrations are applied before the API starts:

   ```sh
   docker compose up -d
   ```

1. Add TLS with a reverse proxy such as `traefik` or `NGINX` ([NGINX config generator](https://www.digitalocean.com/community/tools/nginx)).
