import { ApiProperty } from '@nestjs/swagger';

export class PostVoteResponseV1 {
  @ApiProperty()
  message!: string;
}
