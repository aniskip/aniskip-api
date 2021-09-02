import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { SkipType } from '../../../skip-times.types';

export class PostCreateSkipTimeRequestBodyV1 {
  @IsIn(['op', 'ed'])
  @ApiProperty({ type: String, enum: ['op', 'ed'] })
  skip_type!: SkipType;

  @IsString()
  @ApiProperty()
  provider_name!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0,
  })
  start_time!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0,
  })
  end_time!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0,
  })
  episode_length!: number;

  @IsUUID()
  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  submitter_id!: string;
}
