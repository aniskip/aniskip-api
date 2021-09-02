import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class PostVoteRequestParamsV1 {
  @IsUUID()
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'Skip time UUID',
  })
  skip_id!: string;
}
