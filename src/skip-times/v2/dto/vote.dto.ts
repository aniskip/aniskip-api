import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUUID } from 'class-validator';
import type { VoteType } from '../../skip-times.types';

export class PostVoteRequestParamsV2 {
  @IsUUID()
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'Skip time UUID',
  })
  skipId!: string;
}

export class PostVoteRequestBodyV2 {
  @IsIn(['upvote', 'downvote'])
  @ApiProperty({ enum: ['upvote', 'downvote'] })
  voteType!: VoteType;
}

export class PostVoteResponseV2 {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;
}
