import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { SKIP_TYPES_V2, type SkipTypeV1 } from '../../skip-times.types';

export class PostCreateSkipTimeRequestParamsV2 {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    type: 'integer',
    format: 'int64',
    minimum: 1,
    description: 'MAL id of the anime to create a new skip time for',
  })
  animeId!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0,
    description: 'Episode number of the anime to to create a new skip time for',
  })
  episodeNumber!: number;
}

export class PostCreateSkipTimeRequestBodyV2 {
  @IsIn(SKIP_TYPES_V2)
  @ApiProperty({ type: String, enum: SKIP_TYPES_V2 })
  skipType!: SkipTypeV1;

  @IsString()
  @ApiProperty()
  providerName!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0,
  })
  startTime!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0,
  })
  endTime!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0,
  })
  episodeLength!: number;

  @IsUUID()
  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  submitterId!: string;
}

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
