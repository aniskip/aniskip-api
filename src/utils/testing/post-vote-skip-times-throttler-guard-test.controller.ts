import { Controller, Post, UseGuards, Version } from '@nestjs/common';
import { minutes, Throttle } from '@nestjs/throttler';
import {
  PostVoteSkipTimesV1ThrottlerGuard,
  PostVoteSkipTimesV2ThrottlerGuard,
} from '../throttling';

@Controller()
export class PostVoteSkipTimesThrottlerGuardTestController {
  @Version('1')
  @UseGuards(PostVoteSkipTimesV1ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: minutes(2) } })
  @Post('test/:skip_id')
  getTestV1(): string {
    return 'hello world';
  }

  @Version('2')
  @UseGuards(PostVoteSkipTimesV2ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: minutes(2) } })
  @Post('test/:skipId')
  getTestV2(): string {
    return 'hello world';
  }
}
