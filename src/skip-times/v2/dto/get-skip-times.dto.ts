import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsNumber, Min } from 'class-validator';
import {
  SKIP_TYPES_V2,
  type SkipTimeV2,
  type SkipTypeV2,
} from '../../skip-times.types';
import { IsUnique } from '../../validation/is-unique.validator';

export class GetSkipTimesRequestParamsV2 {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    type: 'integer',
    format: 'int64',
    minimum: 1,
    description: 'MAL id of the anime to get',
  })
  animeId!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0,
    description: 'Episode number to get',
  })
  episodeNumber!: number;
}

export class GetSkipTimesRequestQueryV2 {
  @IsUnique()
  @IsArray()
  @IsIn(SKIP_TYPES_V2, { each: true })
  @Transform(({ value }) => (!Array.isArray(value) ? [value] : value))
  @ApiProperty({
    type: [String],
    enum: SKIP_TYPES_V2,
    description: 'Type of skip time to get',
  })
  types!: SkipTypeV2[];

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0,
    description:
      'Approximate episode length to search for. If the input is 0, it will return all episodes',
  })
  episodeLength!: number;
}

export class GetSkipTimesResponseV2 {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  found!: boolean;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        interval: {
          type: 'object',
          properties: {
            startTime: {
              type: 'number',
              format: 'double',
              minimum: 0,
            },
            endTime: {
              type: 'number',
              format: 'double',
              minimum: 0,
            },
          },
        },
        skipType: {
          type: 'string',
          enum: [...SKIP_TYPES_V2],
        },
        skipId: {
          type: 'string',
          format: 'uuid',
        },
        episodeLength: {
          type: 'number',
          format: 'double',
          minimum: 0,
        },
      },
    },
  })
  results!: SkipTimeV2[];
}
