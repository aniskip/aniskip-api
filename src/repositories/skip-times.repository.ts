import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import {
  DatabaseSkipTime,
  SkipTime,
  CreateSkipTimesQueryResponse,
  SkipType,
  GetAverageOfLastTenSkipTimesVotesQueryResponse,
} from '../skip-times/skip-times.types';

@Injectable()
export class SkipTimesRepository {
  constructor(private database: Pool) {}

  /**
   * Upvotes a skip time and returns if it was successful.
   *
   * @param skipId Skip ID of the skip time to upvote.
   */
  async upvoteSkipTime(skipId: string): Promise<boolean> {
    const { rowCount } = await this.database.query(
      `
      UPDATE
        skip_times
      SET
        votes = votes + 1
      WHERE
        skip_id = $1
      `,
      [skipId]
    );

    return rowCount > 0;
  }

  /**
   * Downvotes a skip time and returns if it was successful.
   *
   * @param skipId Skip ID of the skip time to downvote.
   */
  async downvoteSkipTime(skipId: string): Promise<boolean> {
    const { rowCount } = await this.database.query(
      `
      UPDATE
        skip_times
      SET
        votes = votes - 1
      WHERE
        skip_id = $1
      `,
      [skipId]
    );

    return rowCount > 0;
  }

  /**
   * Creates a new skip time entry.
   *
   * @param skipTime Skip time to create.
   */
  async createSkipTime(
    skipTime: Omit<DatabaseSkipTime, 'skip_id' | 'submit_date'>
  ): Promise<string> {
    const { rows } = await this.database.query<CreateSkipTimesQueryResponse>(
      `
      INSERT INTO skip_times
        VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, DEFAULT, $9)
      RETURNING
        skip_id
      `,
      [
        skipTime.anime_id,
        skipTime.episode_number,
        skipTime.provider_name,
        skipTime.skip_type,
        skipTime.votes,
        skipTime.start_time,
        skipTime.end_time,
        skipTime.episode_length,
        skipTime.submitter_id,
      ]
    );

    return rows[0].skip_id;
  }

  /**
   * Finds the first 10 skip times with matching input parameters.
   *
   * @param animeId Anime id to filter with.
   * @param episodeNumber Episode number to filter with.
   * @param skipType Skip type to filter with.
   */
  async findSkipTimes(
    animeId: number,
    episodeNumber: number,
    skipType: SkipType
  ): Promise<SkipTime[]> {
    const { rows } = await this.database.query<DatabaseSkipTime>(
      `
      SELECT
        skip_id,
        start_time,
        skip_type,
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
      `,
      [animeId, episodeNumber, skipType]
    );

    const skipTimes: SkipTime[] = rows.map((row) => ({
      interval: {
        startTime: row.start_time,
        endTime: row.end_time,
      },
      skipType: row.skip_type,
      skipId: row.skip_id,
      episodeLength: row.episode_length,
    }));

    return skipTimes;
  }

  /**
   * Returns the average of the votes of last ten skip times submitted.
   *
   * @param submitterId ID of the submitter to check.
   */
  async getAverageOfLastTenSkipTimesVotes(
    submitterId: string
  ): Promise<number> {
    const { rows } =
      await this.database.query<GetAverageOfLastTenSkipTimesVotesQueryResponse>(
        `
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
        `,
        [submitterId]
      );

    return rows[0].avg ?? 0;
  }
}
