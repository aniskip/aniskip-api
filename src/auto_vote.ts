import db from './db';
import { getAverageOfLastTenSkipTimesVoteQuery } from './db/db_queries';

/**
 * Determine starting vote of a skip time
 * @param startTime Start time of the skip interval
 * @param endTime End time of the skip interval
 * @param episodeLength Length of the episode
 */
const autoVote = async (
  startTime: number,
  endTime: number,
  episodeLength: number,
  submitterId: string
) => {
  const intervalLength = endTime - startTime;
  if (
    intervalLength > episodeLength * 0.65 ||
    intervalLength < episodeLength * 0.01
  ) {
    return -10;
  }

  const { rows } = await db.query<{ avg: number }>(
    getAverageOfLastTenSkipTimesVoteQuery,
    [submitterId]
  );

  // User has good reputation
  if (rows[0].avg > 2) {
    return 1;
  }

  return 0;
};

export default autoVote;
