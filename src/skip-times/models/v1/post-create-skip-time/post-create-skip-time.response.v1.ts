import { ApiProperty } from '@nestjs/swagger';

export class PostCreateSkipTimeResponseV1 {
  @ApiProperty()
  message!: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  skip_id!: string;
}
