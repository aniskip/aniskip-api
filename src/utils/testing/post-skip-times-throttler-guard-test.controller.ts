import { Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PostSkipTimesV2ThrottlerGuard } from '../throttling';

@Controller()
export class PostSkipTimesThrottlerGuardTestController {
  @UseGuards(PostSkipTimesV2ThrottlerGuard)
  @Throttle(1, 120)
  @Post('test/:animeId/:episodeNumber')
  getTest(): string {
    return 'hello world';
  }
}
