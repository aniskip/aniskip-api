import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { VoteType } from '../../skip-times.types';

export class PostVoteRequestBody {
  @IsIn(['upvote', 'downvote'])
  @ApiProperty({ enum: ['upvote', 'downvote'] })
  voteType!: VoteType;
}
