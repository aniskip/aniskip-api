import { Controller, Post, UseGuards, Version } from "@nestjs/common";
import { minutes, Throttle } from "@nestjs/throttler";
import { CreateSkipTimeThrottlerGuard } from "../create-skip-time-throttler.guard";

@Controller()
export class CreateSkipTimeThrottlerGuardTestController {
  @Version("1")
  @UseGuards(CreateSkipTimeThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: minutes(2) } })
  @Post("test/:anime_id/:episode_number")
  getTestV1(): string {
    return "hello world";
  }

  @Version("2")
  @UseGuards(CreateSkipTimeThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: minutes(2) } })
  @Post("test/:animeId/:episodeNumber")
  getTestV2(): string {
    return "hello world";
  }
}
