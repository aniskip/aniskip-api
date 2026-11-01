#!/bin/bash
# Loads the public dataset (anonymised skip times, refreshed weekly from
# production) into the local dev database. `bun run db:seed` starts the
# services first.
# Pass --force to replace existing rows.
set -euo pipefail

cd "${BASH_SOURCE%/*}/.."

DATASET_URL=https://raw.githubusercontent.com/aniskip/sanitize_db_dump/main/skip_times_public.csv

psql() {
  docker compose -f docker/docker-compose.dev.yml exec -T db \
    psql -U postgres -d db -v ON_ERROR_STOP=1 -q "$@"
}

rows=$(psql -Atc 'SELECT count(*) FROM skip_times')
if [ "$rows" -gt 0 ] && [ "${1:-}" != "--force" ]; then
  echo "skip_times already has $rows rows. Run with --force to replace them." >&2
  exit 1
fi

# Download first, so a failed download never touches the table.
dataset=$(mktemp)
trap 'rm -f "$dataset"' EXIT
curl -fsSL "$DATASET_URL" -o "$dataset"

# The dataset leaves out skip_id (generated here) and submitter_id (random
# per row). One transaction, so the table is never left half-loaded.
psql --single-transaction < "$dataset" \
  -c 'TRUNCATE skip_times' \
  -c 'CREATE TEMP TABLE seed (
        anime_id integer, episode_number real, provider_name varchar(64),
        skip_type varchar(32), votes integer, start_time real, end_time real,
        episode_length real, submit_date date
      ) ON COMMIT DROP' \
  -c '\copy seed FROM pstdin WITH (FORMAT csv, HEADER)' \
  -c 'INSERT INTO skip_times (
        anime_id, episode_number, provider_name, skip_type, votes,
        start_time, end_time, episode_length, submit_date, submitter_id
      )
      SELECT anime_id, episode_number, provider_name, skip_type, votes,
             start_time, end_time, episode_length, submit_date,
             gen_random_uuid()
      FROM seed'

echo "Loaded $(psql -Atc 'SELECT count(*) FROM skip_times') skip times."
