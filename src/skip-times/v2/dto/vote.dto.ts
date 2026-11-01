import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { id } from '../../../common/validation/schemas';
import { VOTE_TYPES } from '../../skip-times.types';

export class PostVoteRequestParamsV2 extends createZodDto(
  z.object({ skipId: id.describe('Skip time UUID') }),
) {}

export class PostVoteRequestBodyV2 extends createZodDto(
  z.object({ voteType: z.enum(VOTE_TYPES) }),
) {}

export class PostVoteResponseV2 extends createZodDto(
  z.object({ statusCode: z.number(), message: z.string() }),
) {}
