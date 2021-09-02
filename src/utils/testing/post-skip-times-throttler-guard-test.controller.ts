import { Controller, Post, UseGuards, Version } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  PostSkipTimesV1ThrottlerGuard,
  PostSkipTimesV2ThrottlerGuard,
} from '../throttling';

@Controller()
export class PostSkipTimesThrottlerGuardTestController {
  @Version('1')
  @UseGuards(PostSkipTimesV1ThrottlerGuard)
  @Throttle(1, 120)
  @Post('test/:anime_id/:episode_number')
  getTestV1(): string {
    return 'hello world';
  }

  @Version('2')
  @UseGuards(PostSkipTimesV2ThrottlerGuard)
  @Throttle(1, 120)
  @Post('test/:animeId/:episodeNumber')
  getTestV2(): string {
    return 'hello world';
  }
}
