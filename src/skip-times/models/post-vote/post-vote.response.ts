import { ApiProperty } from '@nestjs/swagger';

export class PostVoteResponse {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;
}
