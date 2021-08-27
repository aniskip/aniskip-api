import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class PostVoteRequestParams {
  @IsUUID()
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'Skip time UUID',
  })
  skipId!: string;
}
