-- migrate:up
-- Re-runnable (see the first migration): every statement leaves the same
-- result when the change is already there.
ALTER TABLE skip_times
  DROP CONSTRAINT IF EXISTS check_type;

ALTER TABLE skip_times
  ADD CONSTRAINT check_type CHECK (skip_type IN ('op', 'ed', 'mixed-op', 'mixed-ed', 'recap'));

ALTER TABLE skip_times
  ALTER COLUMN skip_type TYPE varchar(32);

ALTER TABLE skip_times
  ALTER COLUMN skip_type SET NOT NULL;

ALTER TABLE skip_times
  DROP CONSTRAINT IF EXISTS check_episode_number;

ALTER TABLE skip_times
  ADD CONSTRAINT check_episode_number CHECK (episode_number >= 0.0);

-- migrate:down
-- Fails if any rows use the newer skip types or episode 0.
ALTER TABLE skip_times
  DROP CONSTRAINT check_episode_number;

ALTER TABLE skip_times
  ADD CONSTRAINT check_episode_number CHECK (episode_number >= 0.5);

ALTER TABLE skip_times
  DROP CONSTRAINT check_type;

ALTER TABLE skip_times
  ALTER COLUMN skip_type TYPE char(2);

ALTER TABLE skip_times
  ADD CONSTRAINT check_type CHECK (skip_type IN ('op', 'ed'));
