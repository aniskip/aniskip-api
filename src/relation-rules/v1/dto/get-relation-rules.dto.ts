import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { malId } from '../../../common/validation/schemas';
import { Rule } from '../../relation-rules.types';

export class GetRelationRulesRequestParamsV1 extends createZodDto(
  z.object({
    anime_id: malId.describe('MAL id of the anime to get rules for'),
  }),
) {}

export class GetRelationRulesResponseV1 extends createZodDto(
  z.object({
    found: z.boolean(),
    rules: z.array(Rule),
  }),
) {}
