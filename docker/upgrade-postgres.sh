#!/bin/bash
# One-time upgrade of the database from Postgres 15 to 18, by dump and
# restore. Runs as part of the deploy, between stop.sh and start.sh, and does
# nothing unless the old Postgres 15 volume exists and the new one doesn't.
# The old volume is left untouched, as a backup.
#
# For the dev services: COMPOSE_FILE=docker-compose.dev.yml ./upgrade-postgres.sh
set -Eeuo pipefail

cd "${BASH_SOURCE%/*}"

project=$(docker compose config | sed -n 's/^name: //p')
old_volume="${project}_database_data"
new_volume="${project}_postgres_data"
old_container="${project}-postgres-15-upgrade"

if ! docker volume inspect "$old_volume" >/dev/null 2>&1; then
  echo "No Postgres 15 volume ($old_volume); nothing to upgrade."
  exit 0
fi
if docker volume inspect "$new_volume" >/dev/null 2>&1; then
  echo "Postgres 18 volume ($new_volume) already exists; nothing to upgrade."
  exit 0
fi

echo "Upgrading $old_volume (Postgres 15) to $new_volume (Postgres 18)."

cleanup() {
  docker rm -f "$old_container" >/dev/null 2>&1 || true
}
failed() {
  trap - ERR
  echo "Upgrade failed; removing $new_volume so the next run starts over." >&2
  docker compose rm -fsv db >/dev/null 2>&1 || true
  docker volume rm "$new_volume" >/dev/null 2>&1 || true
}
trap cleanup EXIT
trap failed ERR

# The old data, on a temporary Postgres 15 that nothing else can reach.
docker run -d --name "$old_container" --network none \
  -v "$old_volume:/var/lib/postgresql/data" \
  -e POSTGRES_PASSWORD=unused postgres:15-alpine >/dev/null
until docker exec "$old_container" pg_isready -h 127.0.0.1 -U postgres -d db >/dev/null 2>&1; do
  sleep 1
done

# The new, empty database, created by Compose with its usual settings.
docker compose up -d --wait db

docker exec "$old_container" pg_dump -U postgres -d db |
  docker compose exec -T db psql -U postgres -d db -v ON_ERROR_STOP=1 -q >/dev/null

count() {
  "$@" psql -U postgres -d db -Atc \
    'SELECT (SELECT count(*) FROM skip_times) || '"'"'/'"'"' || (SELECT count(*) FROM schema_migrations)'
}
before=$(count docker exec "$old_container")
after=$(count docker compose exec -T db)
if [ "$before" != "$after" ]; then
  echo "Row counts differ (skip_times/schema_migrations): $before before, $after after." >&2
  false
fi

echo "Upgraded: $after skip_times/schema_migrations rows. $old_volume is kept as a backup."
