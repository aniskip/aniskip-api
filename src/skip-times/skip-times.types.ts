export const SKIP_TYPES_V1 = ['op', 'ed'] as const;

export type SkipTypeV1 = (typeof SKIP_TYPES_V1)[number];

export type SkipTimeV1 = {
  interval: {
    start_time: number;
    end_time: number;
  };
  skip_type: SkipTypeV1;
  skip_id: string;
  episode_length: number;
};

export const SKIP_TYPES_V2 = [
  ...SKIP_TYPES_V1,
  'mixed-op',
  'mixed-ed',
  'recap',
] as const;

export type SkipTypeV2 = (typeof SKIP_TYPES_V2)[number];

export type SkipTimeV2 = {
  interval: {
    startTime: number;
    endTime: number;
  };
  skipType: SkipTypeV2;
  skipId: string;
  episodeLength: number;
};

export type DatabaseSkipTime = {
  start_time: number;
  end_time: number;
  skip_type: SkipTypeV2;
  skip_id: string;
  episode_length: number;
  anime_id: number;
  episode_number: number;
  provider_name: string;
  votes: number;
  submit_date: Date;
  submitter_id: string;
};

export type CreateSkipTimesQueryResponse = {
  skip_id: string;
};

export type VoteType = 'upvote' | 'downvote';

export type GetAverageOfLastTenSkipTimesVotesQueryResponse = { avg: number };
