import { IsIn } from 'class-validator';
import { VoteType } from '../../skip-times.types';

export class PostVoteRequestBody {
  @IsIn(['upvote', 'downvote'])
  vote_type!: VoteType;
}
