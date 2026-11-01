import { createHash } from 'node:crypto';
import type { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

export class PostSkipTimesV1ThrottlerGuard extends ThrottlerGuard {
  override generateKey(context: ExecutionContext, suffix: string): string {
    const { req } = this.getRequestResponse(context);
    const prefix = `${context.getClass().name}-${context.getHandler().name}-${
      req.params.anime_id
    }-${req.params.episode_number}`;

    return createHash('md5').update(`${prefix}-${suffix}`).digest('hex');
  }
}
