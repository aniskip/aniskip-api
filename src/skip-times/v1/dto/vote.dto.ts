import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { id } from '../../../common/validation/schemas';
import { VOTE_TYPES } from '../../skip-times.types';

export class PostVoteRequestParamsV1 extends createZodDto(
  z.object({ skip_id: id.describe('Skip time UUID') }),
) {}

export class PostVoteRequestBodyV1 extends createZodDto(
  z.object({ vote_type: z.enum(VOTE_TYPES) }),
) {}

export class PostVoteResponseV1 extends createZodDto(
  z.object({ message: z.string() }),
) {}
