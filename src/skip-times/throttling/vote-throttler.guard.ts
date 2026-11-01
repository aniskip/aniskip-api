import { createHash } from 'node:crypto';
import type { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Rate limits votes per client and skip time, so voting on one skip time
 * doesn't count against another.
 */
export class VoteThrottlerGuard extends ThrottlerGuard {
  override generateKey(
    context: ExecutionContext,
    suffix: string,
    name: string,
  ): string {
    const { req } = this.getRequestResponse(context);
    // v1 routes use snake_case parameters, v2 camelCase.
    const skipId = req.params.skipId ?? req.params.skip_id;
    const prefix = `${context.getClass().name}-${context.getHandler().name}-${skipId}`;

    return createHash('md5')
      .update(`${prefix}-${name}-${suffix}`)
      .digest('hex');
  }
}
