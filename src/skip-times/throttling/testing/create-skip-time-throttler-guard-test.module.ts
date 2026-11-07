import { Module } from "@nestjs/common";
import { minutes, ThrottlerModule } from "@nestjs/throttler";
import { CreateSkipTimeThrottlerGuardTestController } from "./create-skip-time-throttler-guard-test.controller";

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: minutes(1), limit: 120 }])],
  controllers: [CreateSkipTimeThrottlerGuardTestController],
})
export class CreateSkipTimeThrottlerGuardTestModule {}
