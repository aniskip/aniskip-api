import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsNumber, Min } from 'class-validator';
import {
  SKIP_TYPES_V1,
  type SkipTimeV1,
  type SkipTimeV2,
  type SkipTypeV1,
} from '../../skip-times.types';
import { IsUnique } from '../../validation/is-unique.validator';

export class GetSkipTimesRequestParamsV1 {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    type: 'integer',
    format: 'int64',
    minimum: 1,
    description: 'MAL id of the anime to get',
  })
  anime_id!: number;

  @IsNumber()
  @Min(0.5)
  @Type(() => Number)
  @ApiProperty({
    type: Number,
    format: 'double',
    minimum: 0.5,
    description: 'Episode number to get',
  })
  episode_number!: number;
}

export class GetSkipTimesRequestQueryV1 {
  @IsUnique()
  @IsArray()
  @IsIn(SKIP_TYPES_V1, { each: true })
  @Transform(({ value }) => (!Array.isArray(value) ? [value] : value))
  @ApiProperty({
    type: [String],
    enum: SKIP_TYPES_V1,
    description: 'Type of skip time to get',
  })
  types!: SkipTypeV1[];
}

export class GetSkipTimesResponseV1 {
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
            start_time: {
              type: 'number',
              format: 'double',
              minimum: 0,
            },
            end_time: {
              type: 'number',
              format: 'double',
              minimum: 0,
            },
          },
        },
        skip_type: {
          type: 'string',
          enum: [...SKIP_TYPES_V1],
        },
        skip_id: {
          type: 'string',
          format: 'uuid',
        },
        episode_length: {
          type: 'number',
          format: 'double',
          minimum: 0,
        },
      },
    },
  })
  results!: SkipTimeV1[];
}

/** Converts a skip time to v1's snake_case response format. */
export function toSkipTimeV1(skipTime: SkipTimeV2): SkipTimeV1 {
  return {
    interval: {
      start_time: skipTime.interval.startTime,
      end_time: skipTime.interval.endTime,
    },
    skip_type: skipTime.skipType as SkipTypeV1,
    skip_id: skipTime.skipId,
    episode_length: skipTime.episodeLength,
  };
}
