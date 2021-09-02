import { Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PostVoteSkipTimesV1ThrottlerGuard } from '../throttling';

@Controller()
export class PostVoteSkipTimesThrottlerGuardTestController {
  @UseGuards(PostVoteSkipTimesV1ThrottlerGuard)
  @Throttle(1, 120)
  @Post('test/:skipId')
  getTest(): string {
    return 'hello world';
  }
}
