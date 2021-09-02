export type SkipType = 'op' | 'ed';

export type SkipTime = {
  interval: {
    startTime: number;
    endTime: number;
  };
  skipType: SkipType;
  skipId: string;
  episodeLength: number;
};

export type SnakeCaseSkipTime = {
  interval: {
    start_time: number;
    end_time: number;
  };
  skip_type: SkipType;
  skip_id: string;
  episode_length: number;
};

export type DatabaseSkipTime = {
  start_time: number;
  end_time: number;
  skip_type: SkipType;
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
