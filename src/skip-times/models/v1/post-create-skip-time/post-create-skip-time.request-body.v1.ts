import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { SkipTypeV1, SkipTypesV1 } from '../../../skip-times.types';

export class PostCreateSkipTimeRequestBodyV1 {
  @IsIn(SkipTypesV1)
  @ApiProperty({ type: String, enum: SkipTypesV1 })
  skip_type!: SkipTypeV1;

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
