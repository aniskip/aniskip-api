import { createHash } from 'node:crypto';
import type { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

export class PostVoteSkipTimesV2ThrottlerGuard extends ThrottlerGuard {
  override generateKey(context: ExecutionContext, suffix: string): string {
    const { req } = this.getRequestResponse(context);
    const prefix = `${context.getClass().name}-${context.getHandler().name}-${
      req.params.skipId
    }`;

    return createHash('md5').update(`${prefix}-${suffix}`).digest('hex');
  }
}
