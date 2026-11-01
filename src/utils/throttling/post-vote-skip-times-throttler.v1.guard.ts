import { createHash } from 'node:crypto';
import type { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

export class PostVoteSkipTimesV1ThrottlerGuard extends ThrottlerGuard {
  override generateKey(
    context: ExecutionContext,
    suffix: string,
    name: string,
  ): string {
    const { req } = this.getRequestResponse(context);
    const prefix = `${context.getClass().name}-${context.getHandler().name}-${
      req.params.skip_id
    }`;

    return createHash('md5')
      .update(`${prefix}-${name}-${suffix}`)
      .digest('hex');
  }
}
