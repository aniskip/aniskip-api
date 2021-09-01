import { Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PostVoteSkipTimesThrottlerGuard } from '../throttling';

@Controller()
export class PostVoteSkipTimesThrottlerGuardTestController {
  @UseGuards(PostVoteSkipTimesThrottlerGuard)
  @Throttle(1, 120)
  @Post('test/:skipId')
  getTest(): string {
    return 'hello world';
  }
}
