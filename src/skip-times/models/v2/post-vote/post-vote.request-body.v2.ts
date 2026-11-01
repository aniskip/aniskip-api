import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import type { VoteType } from '../../../skip-times.types';

export class PostVoteRequestBodyV2 {
  @IsIn(['upvote', 'downvote'])
  @ApiProperty({ enum: ['upvote', 'downvote'] })
  voteType!: VoteType;
}
