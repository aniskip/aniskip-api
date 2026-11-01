import { z } from 'zod';
import { id } from '../common/validation/schemas';

export const SKIP_TYPES_V1 = ['op', 'ed'] as const;

export type SkipTypeV1 = (typeof SKIP_TYPES_V1)[number];

export const SKIP_TYPES_V2 = [
  ...SKIP_TYPES_V1,
  'mixed-op',
  'mixed-ed',
  'recap',
] as const;

export type SkipTypeV2 = (typeof SKIP_TYPES_V2)[number];

export const VOTE_TYPES = ['upvote', 'downvote'] as const;

export type VoteType = (typeof VOTE_TYPES)[number];

/** A skip time as v1 returns it, in snake_case. */
export const SkipTimeV1 = z.object({
  interval: z.object({
    start_time: z.number().min(0),
    end_time: z.number().min(0),
  }),
  skip_type: z.enum(SKIP_TYPES_V1),
  skip_id: id,
  episode_length: z.number().min(0),
});

export type SkipTimeV1 = z.infer<typeof SkipTimeV1>;

/** A skip time as v2 returns it, and as the service passes it around. */
export const SkipTimeV2 = z.object({
  interval: z.object({
    startTime: z.number().min(0),
    endTime: z.number().min(0),
  }),
  skipType: z.enum(SKIP_TYPES_V2),
  skipId: id,
  episodeLength: z.number().min(0),
});

export type SkipTimeV2 = z.infer<typeof SkipTimeV2>;

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

export type GetAverageOfLastTenSkipTimesVotesQueryResponse = { avg: number };
