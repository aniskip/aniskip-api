const skipTimesQuery = `
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
ORDER BY
  votes DESC
LIMIT 10
`;

export default skipTimesQuery;
