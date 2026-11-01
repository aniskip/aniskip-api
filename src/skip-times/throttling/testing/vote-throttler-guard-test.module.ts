import { Module } from '@nestjs/common';
import { minutes, ThrottlerModule } from '@nestjs/throttler';
import { VoteThrottlerGuardTestController } from './vote-throttler-guard-test.controller';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: minutes(1), limit: 120 }])],
  controllers: [VoteThrottlerGuardTestController],
})
export class VoteThrottlerGuardTestModule {}
