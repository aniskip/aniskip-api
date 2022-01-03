import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import md5 from 'md5';

export class PostVoteSkipTimesV1ThrottlerGuard extends ThrottlerGuard {
  generateKey(context: ExecutionContext, suffix: string): string {
    const { req } = this.getRequestResponse(context);
    const prefix = `${context.getClass().name}-${context.getHandler().name}-${
      req.params.skip_id
    }`;

    return md5(`${prefix}-${suffix}`);
  }
}
