import { Controller, Post, UseGuards, Version } from '@nestjs/common';
import { minutes, Throttle } from '@nestjs/throttler';
import { VoteThrottlerGuard } from '../vote-throttler.guard';

@Controller()
export class VoteThrottlerGuardTestController {
  @Version('1')
  @UseGuards(VoteThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: minutes(2) } })
  @Post('test/:skip_id')
  getTestV1(): string {
    return 'hello world';
  }

  @Version('2')
  @UseGuards(VoteThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: minutes(2) } })
  @Post('test/:skipId')
  getTestV2(): string {
    return 'hello world';
  }
}
