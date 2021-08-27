import { ApiProperty } from '@nestjs/swagger';

export class PostCreateSkipTimeResponse {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  skipId!: string;
}
