import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { SKIP_TYPES_V1, type SkipTypeV1 } from '../../skip-times.types';

export class PostCreateSkipTimeRequestParamsV1 {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    type: 'integer',
    format: 'int64',
    minimum: 1,
    description: 'MAL id of the anime to create a new skip time for',
  })
  anime_id!: number;

  @IsNumber()
  @Min(0.5)
  @Type(() => Number)
  @ApiProperty({
    type: 'number',
    format: 'double',
    minimum: 0.5,
    description: 'Episode number of the anime to to create a new skip time for',
  })
  episode_number!: number;
}

export class PostCreateSkipTimeRequestBodyV1 {
  @IsIn(SKIP_TYPES_V1)
  @ApiProperty({ type: String, enum: SKIP_TYPES_V1 })
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

export class PostCreateSkipTimeResponseV1 {
  @ApiProperty()
  message!: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  skip_id!: string;
}
