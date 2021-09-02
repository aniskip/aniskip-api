import { ApiProperty } from '@nestjs/swagger';
import { Rule } from 'src/relation-rules/relation-rules.types';

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
