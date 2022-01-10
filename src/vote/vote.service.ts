import { Injectable } from '@nestjs/common';
import { SkipTimesRepository } from '../repositories';
import { EpisodeType } from './vote.types';
import { SkipTypeV2 } from '../skip-times/skip-times.types';

@Injectable()
export class VoteService {
  constructor(private skipTimesRepository: SkipTimesRepository) {}

  /**
   * Returns the type of episode according to specified intervals.
   *
   * @param episodeLength Length of episode.
   */
  getEpisodeType(episodeLength: number): EpisodeType {
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
  }

  /**
   * Determine starting vote of a skip time.
   *
   * @param startTime Start time of the skip interval.
   * @param endTime End time of the skip interval.
   * @param episodeLength Length of the episode.
   */
  async autoVote(
    startTime: number,
    endTime: number,
    episodeLength: number,
    submitterId: string,
    skipType?: SkipTypeV2
  ): Promise<number> {
    const episodeType = this.getEpisodeType(episodeLength);
    const intervalLength = endTime - startTime;

    if (intervalLength < 5) {
      return -10;
    }

    switch (skipType) {
      case 'recap': {
        switch (episodeType) {
          case 'short': {
            // 40 seconds.
            if (intervalLength > 40) {
              return -10;
            }
            break;
          }
          case 'half': {
            // 3 minutes.
            if (intervalLength > 60 * 3) {
              return -10;
            }
            break;
          }
          case 'full': {
            // 6 minutes.
            if (intervalLength > 60 * 6) {
              return -10;
            }
            break;
          }
          case 'movie': {
            // 12 minutes.
            if (intervalLength > 60 * 12) {
              return -10;
            }
            break;
          }
          // no default
        }
        break;
      }
      default: {
        switch (episodeType) {
          case 'short': {
            // 40 seconds.
            if (intervalLength > 40) {
              return -10;
            }
            break;
          }
          case 'half': {
            // 2 minutes.
            if (intervalLength > 60 * 2) {
              return -10;
            }
            break;
          }
          case 'full': {
            // 3 minutes.
            if (intervalLength > 60 * 3) {
              return -10;
            }
            break;
          }
          case 'movie': {
            // 8 minutes.
            if (intervalLength > 60 * 8) {
              return -10;
            }
            break;
          }
          // no default
        }
      }
    }

    const averageVotes =
      await this.skipTimesRepository.getAverageOfLastTenSkipTimesVotes(
        submitterId
      );

    // User has good reputation.
    if (averageVotes > 2) {
      return 1;
    }

    return 0;
  }
}
