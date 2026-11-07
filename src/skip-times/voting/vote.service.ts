import { Injectable } from "@nestjs/common";
import { SkipTimesRepository } from "../skip-times.repository";
import type { SkipTypeV2 } from "../skip-times.types";
import type { EpisodeType } from "./vote.types";

/** Starting votes of a rejected skip time. Skip times at -2 or below are hidden. */
const REJECTED_VOTES = -10;

/** Shortest accepted skip interval. */
const MIN_INTERVAL_SECONDS = 5;

/** Longest accepted opening per episode type. */
const MAX_OPENING_SECONDS: Record<EpisodeType, number> = {
  short: 40,
  half: 60 * 2,
  full: 60 * 3,
  movie: 60 * 8,
};

/**
 * Longest accepted ending per episode type. Endings in full episodes can run
 * past 3 minutes; openings longer than that are usually a cold open skipped
 * from 0:00 as well, so they keep the lower limit.
 */
const MAX_ENDING_SECONDS: Record<EpisodeType, number> = {
  ...MAX_OPENING_SECONDS,
  full: 60 * 4,
};

/** Longest accepted recap per episode type. */
const MAX_RECAP_SECONDS: Record<EpisodeType, number> = {
  short: 40,
  half: 60 * 3,
  full: 60 * 6,
  movie: 60 * 12,
};

/**
 * Submitters whose last ten skip times average more than this many votes are
 * trusted: their skip times start with a vote, and may run a little longer
 * than the limits above (e.g. the occasional long ending).
 */
const TRUSTED_AVERAGE_VOTES = 3;
const TRUSTED_EXTRA_SECONDS = 60;

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
      return "short";
    }

    // 12 minutes.
    if (episodeLength < 60 * 12) {
      return "half";
    }

    // 35 minutes.
    if (episodeLength < 60 * 35) {
      return "full";
    }

    return "movie";
  }

  /**
   * Returns the longest accepted interval per episode type for a skip type.
   *
   * @param skipType Type of the skip time. v1 has no mixed or recap types.
   */
  private getLimits(skipType?: SkipTypeV2): Record<EpisodeType, number> {
    switch (skipType) {
      case "recap":
        return MAX_RECAP_SECONDS;
      case "ed":
      case "mixed-ed":
        return MAX_ENDING_SECONDS;
      default:
        return MAX_OPENING_SECONDS;
    }
  }

  /**
   * Determine starting vote of a skip time.
   *
   * @param startTime Start time of the skip interval.
   * @param endTime End time of the skip interval.
   * @param episodeLength Length of the episode.
   * @param submitterId Submitter of the skip time.
   * @param skipType Type of the skip time.
   */
  async autoVote(
    startTime: number,
    endTime: number,
    episodeLength: number,
    submitterId: string,
    skipType?: SkipTypeV2,
  ): Promise<number> {
    const intervalLength = endTime - startTime;

    if (intervalLength < MIN_INTERVAL_SECONDS) {
      return REJECTED_VOTES;
    }

    const averageVotes =
      await this.skipTimesRepository.getAverageOfLastTenSkipTimesVotes(submitterId);
    const isTrusted = averageVotes > TRUSTED_AVERAGE_VOTES;

    const limits = this.getLimits(skipType);
    const maxIntervalLength =
      limits[this.getEpisodeType(episodeLength)] + (isTrusted ? TRUSTED_EXTRA_SECONDS : 0);

    if (intervalLength > maxIntervalLength) {
      return REJECTED_VOTES;
    }

    return isTrusted ? 1 : 0;
  }
}
