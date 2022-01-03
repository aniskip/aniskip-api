import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import md5 from 'md5';

export class PostSkipTimesV1ThrottlerGuard extends ThrottlerGuard {
  generateKey(context: ExecutionContext, suffix: string): string {
    const { req } = this.getRequestResponse(context);
    const prefix = `${context.getClass().name}-${context.getHandler().name}-${
      req.params.anime_id
    }-${req.params.episode_number}`;

    return md5(`${prefix}-${suffix}`);
  }
}
