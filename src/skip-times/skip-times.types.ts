export type SkipType = 'op' | 'ed';

export type SkipTime = {
  interval: {
    start_time: number;
    end_time: number;
  };
  skip_type: SkipType;
  skip_id: string;
  episode_length: number;
};

export type InternalSkipTime = Omit<SkipTime, 'interval'> &
  SkipTime['interval'] & {
    anime_id: number;
    episode_number: number;
    provider_name: string;
    votes: number;
    submit_date: Date;
    submitter_id: string;
  };

export type SkipTimesCreateQueryResponse = {
  skip_id: string;
};

export type VoteType = 'upvote' | 'downvote';
