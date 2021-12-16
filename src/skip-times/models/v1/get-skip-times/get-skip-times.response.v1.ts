import { ApiProperty } from '@nestjs/swagger';
import { SkipTimeV1, SkipTypesV1 } from '../../../skip-times.types';

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
          enum: [...SkipTypesV1],
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
