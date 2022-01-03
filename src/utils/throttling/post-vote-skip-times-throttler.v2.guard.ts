import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import md5 from 'md5';

export class PostVoteSkipTimesV2ThrottlerGuard extends ThrottlerGuard {
  generateKey(context: ExecutionContext, suffix: string): string {
    const { req } = this.getRequestResponse(context);
    const prefix = `${context.getClass().name}-${context.getHandler().name}-${
      req.params.skipId
    }`;

    return md5(`${prefix}-${suffix}`);
  }
}
