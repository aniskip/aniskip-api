\c db;
ALTER TABLE skip_times
  DROP CONSTRAINT check_type;

ALTER TABLE skip_times
  ADD CONSTRAINT check_type CHECK (skip_type IN ('op', 'ed', 'mixed-op', 'mixed-ed', 'recap'));

ALTER TABLE skip_times
  ALTER COLUMN skip_type TYPE VARCHAR(32);

ALTER TABLE skip_times
  ALTER COLUMN skip_type SET NOT NULL;

ALTER TABLE skip_times
  DROP CONSTRAINT check_episode_number;

ALTER TABLE skip_times
  ADD CONSTRAINT check_episode_number CHECK (episode_number >= 0.0);

