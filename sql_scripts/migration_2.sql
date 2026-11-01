\c db;
-- Indexes for the hot read paths. CONCURRENTLY avoids locking writes while
-- building on a live database; it must run outside a transaction (psql -f is
-- fine).

-- findSkipTimes: equality lookup on (anime_id, episode_number, skip_type).
-- votes is deliberately left out so vote UPDATEs stay HOT (no index churn);
-- each key only has a handful of rows, so sorting by votes afterwards is cheap.
CREATE INDEX CONCURRENTLY IF NOT EXISTS skip_times_anime_episode_type_idx
  ON skip_times (anime_id, episode_number, skip_type);

-- getAverageOfLastTenSkipTimesVotes: latest submissions per submitter.
CREATE INDEX CONCURRENTLY IF NOT EXISTS skip_times_submitter_date_idx
  ON skip_times (submitter_id, submit_date DESC);
