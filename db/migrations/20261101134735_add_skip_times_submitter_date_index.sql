-- migrate:up transaction:false
-- One statement only; see the previous migration.

-- getAverageOfLastTenSkipTimesVotes: latest submissions per submitter.
CREATE INDEX CONCURRENTLY IF NOT EXISTS skip_times_submitter_date_idx
  ON skip_times (submitter_id, submit_date DESC);

-- migrate:down transaction:false
DROP INDEX CONCURRENTLY IF EXISTS skip_times_submitter_date_idx;
