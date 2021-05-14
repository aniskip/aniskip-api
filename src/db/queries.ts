export const skipTimesSelectQuery = `
SELECT
  skip_id,
  start_time,
  end_time,
  episode_length
FROM
  skip_times
WHERE
  anime_id = $1
  AND episode_number = $2
  AND skip_type = $3
  AND votes > -2
ORDER BY
  votes DESC
LIMIT 10
`;

export const skipTimesInsertQuery = `
INSERT INTO skip_times
  VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, DEFAULT, $9)
RETURNING
  skip_id
`;

export const skipTimesInsertNoDefaultsQuery = `
INSERT INTO skip_times
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
`;

export const skipTimesUpvoteQuery = `
UPDATE
  skip_times
SET
  votes = votes + 1
WHERE
  skip_id = $1
`;

export const skipTimesDownvoteQuery = `
UPDATE
  skip_times
SET
  votes = votes - 1
WHERE
  skip_id = $1
`;

export const getAverageOfLastTenSkipTimesVoteQuery = `
SELECT
  avg(t.votes)
FROM (
  SELECT
    votes
  FROM
    skip_times
  WHERE
    submitter_id = $1
  LIMIT 10) AS t
`;