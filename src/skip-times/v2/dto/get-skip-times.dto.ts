import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  malId,
  seconds,
  uniqueArray,
} from '../../../common/validation/schemas';
import { SKIP_TYPES_V2, SkipTimeV2 } from '../../skip-times.types';

export class GetSkipTimesRequestParamsV2 extends createZodDto(
  z.object({
    animeId: malId.describe('MAL id of the anime to get'),
    episodeNumber: z.coerce.number().min(0).describe('Episode number to get'),
  }),
) {}

export class GetSkipTimesRequestQueryV2 extends createZodDto(
  z.object({
    types: uniqueArray(z.enum(SKIP_TYPES_V2)).describe(
      'Type of skip time to get',
    ),
    episodeLength: seconds.describe(
      'Approximate episode length to search for. If the input is 0, it will return all episodes',
    ),
  }),
) {}

export class GetSkipTimesResponseV2 extends createZodDto(
  z.object({
    statusCode: z.number(),
    message: z.string(),
    found: z.boolean(),
    results: z.array(SkipTimeV2),
  }),
) {}
