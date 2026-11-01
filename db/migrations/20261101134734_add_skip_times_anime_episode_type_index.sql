-- migrate:up transaction:false
-- CONCURRENTLY avoids locking writes while building on a live database. It
-- can't run in a transaction, and Postgres wraps a multi-statement query in
-- one, so each index gets its own migration with a single statement.

-- findSkipTimes: equality lookup on (anime_id, episode_number, skip_type).
-- votes is deliberately left out so vote UPDATEs stay HOT (no index churn);
-- each key only has a handful of rows, so sorting by votes afterwards is cheap.
CREATE INDEX CONCURRENTLY IF NOT EXISTS skip_times_anime_episode_type_idx
  ON skip_times (anime_id, episode_number, skip_type);

-- migrate:down transaction:false
DROP INDEX CONCURRENTLY IF EXISTS skip_times_anime_episode_type_idx;
