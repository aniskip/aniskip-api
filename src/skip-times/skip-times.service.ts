import { Injectable } from '@nestjs/common';
import { SkipTimesRepository } from './skip-times.repository';
import {
  InternalSkipTime,
  SkipTime,
  SkipType,
  VoteType,
} from './skip-times.types';

@Injectable()
export class SkipTimesService {
  constructor(private skipTimesRepository: SkipTimesRepository) {}

  /**
   * Vote on a skip time.
   *
   * @param voteType Voting type, can be upvote or downvote.
   * @param skipId Skip Id to upvote or downvote.
   */
  async vote(voteType: VoteType, skipId: string): Promise<boolean> {
    let voteSuccessful = false;

    switch (voteType) {
      case 'upvote':
        voteSuccessful = await this.skipTimesRepository.upvote(skipId);
        break;
      case 'downvote':
        voteSuccessful = await this.skipTimesRepository.downvote(skipId);
        break;
      default:
    }

    return voteSuccessful;
  }

  /**
   * Create a new skip time entry.
   *
   * @param skipTime Skip time to create.
   */
  async create(skipTime: InternalSkipTime): Promise<string> {
    return this.skipTimesRepository.create(skipTime);
  }

  /**
   * Finds one skip time of each skip type passed.
   *
   * @param animeId MAL id filter.
   * @param episodeNumber Episode number filter.
   * @param skipTypes Skip types to filter, should be unique.
   */
  async find(
    animeId: number,
    episodeNumber: number,
    skipTypes: SkipType[]
  ): Promise<SkipTime[]> {
    const result: SkipTime[] = (
      await Promise.all(
        skipTypes.map(async (skipType) => {
          const skipTimes = await this.skipTimesRepository.find(
            animeId,
            episodeNumber,
            skipType
          );

          if (skipTimes.length === 0) {
            return null;
          }

          return skipTimes[0];
        })
      )
    ).filter((skipTime): skipTime is SkipTime => skipTime !== null);

    return result;
  }
}
