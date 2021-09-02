import { ApiProperty } from '@nestjs/swagger';

export class PostVoteResponseV2 {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;
}
