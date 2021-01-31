interface SkipTimesDatabaseType {
  skip_id: string;
  anime_id: number;
  episode_number: number;
  provider_name: string;
  skip_type: 'op' | 'ed';
  votes: number;
  start_time: number;
  end_time: number;
  episode_length: number;
  submit_date: Date;
  submitter_id: string;
}

export default SkipTimesDatabaseType;
