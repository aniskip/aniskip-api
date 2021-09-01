import { Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PostSkipTimesThrottlerGuard } from '../throttling';

@Controller()
export class PostSkipTimesThrottlerGuardTestController {
  @UseGuards(PostSkipTimesThrottlerGuard)
  @Throttle(1, 120)
  @Post('test/:animeId/:episodeNumber')
  getTest(): string {
    return 'hello world';
  }
}
