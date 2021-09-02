import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class PostVoteRequestParamsV2 {
  @IsUUID()
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'Skip time UUID',
  })
  skipId!: string;
}
