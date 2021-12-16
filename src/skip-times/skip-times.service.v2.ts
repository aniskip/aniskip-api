import { Injectable } from '@nestjs/common';
import { SkipTimesRepository } from '../repositories';
import { VoteService } from '../vote';
import {
  DatabaseSkipTime,
  SkipTimeV2,
  SkipTypeV2,
  VoteType,
} from './skip-times.types';

@Injectable()
export class SkipTimesServiceV2 {
  constructor(
    private skipTimesRepository: SkipTimesRepository,
    private voteService: VoteService
  ) {}

  /**
   * Vote on a skip time.
   *
   * @param voteType Voting type, can be upvote or downvote.
   * @param skipId Skip Id to upvote or downvote.
   */
  async voteSkipTime(voteType: VoteType, skipId: string): Promise<boolean> {
    let voteSuccessful = false;

    switch (voteType) {
      case 'upvote':
        voteSuccessful = await this.skipTimesRepository.upvoteSkipTime(skipId);
        break;
      case 'downvote':
        voteSuccessful = await this.skipTimesRepository.downvoteSkipTime(
          skipId
        );
        break;
      // no default
    }

    return voteSuccessful;
  }

  /**
   * Create a new skip time entry.
   *
   * @param skipTime Skip time to create.
   */
  async createSkipTime(
    skipTime: Omit<DatabaseSkipTime, 'skip_id' | 'submit_date' | 'votes'>
  ): Promise<string> {
    const votes = await this.voteService.autoVote(
      skipTime.start_time,
      skipTime.end_time,
      skipTime.episode_length,
      skipTime.submitter_id
    );

    const skipTimeWithVotes = {
      ...skipTime,
      votes,
    };

    return this.skipTimesRepository.createSkipTime(skipTimeWithVotes);
  }

  /**
   * Finds one skip time of each skip type passed.
   *
   * @param animeId MAL id filter.
   * @param episodeNumber Episode number filter.
   * @param skipTypes Skip types to filter, should be unique.
   */
  async findSkipTimes(
    animeId: number,
    episodeNumber: number,
    skipTypes: SkipTypeV2[]
  ): Promise<SkipTimeV2[]> {
    const result: SkipTimeV2[] = (
      await Promise.all(
        skipTypes.map(async (skipType) => {
          const skipTimes = await this.skipTimesRepository.findSkipTimes(
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
    ).filter((skipTime): skipTime is SkipTimeV2 => skipTime !== null);

    return result;
  }
}
