import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import type { Rule } from '../../relation-rules.types';

export class GetRelationRulesRequestParamsV2 {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    type: 'integer',
    format: 'int64',
    minimum: 1,
    description: 'MAL id of the anime to get rules for',
  })
  animeId!: number;
}

export class GetRelationRulesResponseV2 {
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
        from: {
          type: 'object',
          required: ['start'],
          properties: {
            start: {
              type: 'integer',
              format: 'int64',
              minimum: 1,
            },
            end: {
              type: 'integer',
              format: 'int64',
              minimum: 1,
            },
          },
        },
        to: {
          type: 'object',
          required: ['start', 'malId'],
          properties: {
            malId: {
              type: 'integer',
              format: 'int64',
              minimum: 1,
            },
            start: {
              type: 'integer',
              format: 'int64',
              minimum: 1,
            },
            end: {
              type: 'integer',
              format: 'int64',
              minimum: 1,
            },
          },
        },
      },
    },
  })
  rules!: Rule[];
}
