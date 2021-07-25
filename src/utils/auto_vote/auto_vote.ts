import db from '../../db';
import { getAverageOfLastTenSkipTimesVoteQuery } from '../../db/queries';
import { EpisodeType } from './auto_vote.types';

/**
 * Returns the type of episode according to specified intervals.
 *
 * @param episodeLength Length of episode.
 */
const getEpisodeType = (episodeLength: number): EpisodeType => {
  // 2 minutes.
  if (episodeLength < 60 * 2) {
    return 'short';
  }

  // 12 minutes.
  if (episodeLength < 60 * 12) {
    return 'half';
  }

  // 35 minutes.
  if (episodeLength < 60 * 35) {
    return 'full';
  }

  return 'movie';
};

/**
 * Determine starting vote of a skip time.
 *
 * @param startTime Start time of the skip interval.
 * @param endTime End time of the skip interval.
 * @param episodeLength Length of the episode.
 */
export const autoVote = async (
  startTime: number,
  endTime: number,
  episodeLength: number,
  submitterId: string
): Promise<number> => {
  const episodeType = getEpisodeType(episodeLength);
  const intervalLength = endTime - startTime;

  if (intervalLength < 5) {
    return -10;
  }

  switch (episodeType) {
    case 'short':
      if (intervalLength > 40) {
        return -10;
      }
      break;
    case 'half':
      // 2 minutes.
      if (intervalLength > 60 * 2) {
        return -10;
      }
      break;
    case 'full':
      // 3 minutes.
      if (intervalLength > 60 * 3) {
        return -10;
      }
      break;
    case 'movie':
      // 8 minutes.
      if (intervalLength > 60 * 8) {
        return -10;
      }
      break;
    default:
  }

  const { rows } = await db.query<{ avg: number }>(
    getAverageOfLastTenSkipTimesVoteQuery,
    [submitterId]
  );

  // User has good reputation.
  if (rows[0].avg > 2) {
    return 1;
  }

  return 0;
};
