import { ApiProperty } from '@nestjs/swagger';

export class PostCreateSkipTimeResponseV2 {
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
