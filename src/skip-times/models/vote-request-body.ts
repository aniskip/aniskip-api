import { IsIn } from 'class-validator';
import { VoteType } from '../skip-times.types';

export class VoteRequestBody {
  @IsIn(['upvote', 'downvote'])
  vote_type!: VoteType;
}
