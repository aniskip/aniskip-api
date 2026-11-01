import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUUID } from 'class-validator';
import type { VoteType } from '../../skip-times.types';

export class PostVoteRequestParamsV1 {
  @IsUUID()
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'Skip time UUID',
  })
  skip_id!: string;
}

export class PostVoteRequestBodyV1 {
  @IsIn(['upvote', 'downvote'])
  @ApiProperty({ enum: ['upvote', 'downvote'] })
  vote_type!: VoteType;
}

export class PostVoteResponseV1 {
  @ApiProperty()
  message!: string;
}
