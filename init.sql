CREATE DATABASE db;

\c db;
CREATE TABLE skip_times (
  skip_id uuid UNIQUE NOT NULL DEFAULT gen_random_uuid (),
  anime_id integer NOT NULL,
  episode_number real NOT NULL,
  provider_name varchar(64) NOT NULL,
  skip_type char(2),
  votes integer,
  start_time real NOT NULL,
  end_time real NOT NULL,
  anime_length real NOT NULL,
  submit_date timestamp NOT NULL,
  submitter_id uuid NOT NULL,
  PRIMARY KEY (skip_id),
  CONSTRAINT check_type CHECK (skip_type IN ('OP', 'ED')),
  CONSTRAINT check_anime_length CHECK (anime_length >= 0),
  CONSTRAINT check_start_time CHECK (start_time >= 0),
  CONSTRAINT check_anime_id CHECK (anime_id >= 0),
  CONSTRAINT check_end_time CHECK (end_time >= 0 AND end_time > start_time AND end_time <= anime_length)
);

