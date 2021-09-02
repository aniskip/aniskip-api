import { ApiProperty } from '@nestjs/swagger';
import { SkipTime } from '../../../skip-times.types';

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
          enum: ['op', 'ed'],
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
  results!: SkipTime[];
}
