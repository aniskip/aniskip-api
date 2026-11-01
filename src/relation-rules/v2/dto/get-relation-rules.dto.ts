import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { malId } from '../../../common/validation/schemas';
import { Rule } from '../../relation-rules.types';

export class GetRelationRulesRequestParamsV2 extends createZodDto(
  z.object({
    animeId: malId.describe('MAL id of the anime to get rules for'),
  }),
) {}

export class GetRelationRulesResponseV2 extends createZodDto(
  z.object({
    statusCode: z.number(),
    message: z.string(),
    found: z.boolean(),
    rules: z.array(Rule),
  }),
) {}
