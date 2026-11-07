import { Inject, Module, type OnApplicationShutdown } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TerminusModule } from "@nestjs/terminus";
import Redis, { type RedisOptions } from "ioredis";
import { DatabaseModule } from "../database/database.module";
import { REDIS } from "./health.constants";
import { HealthController } from "./health.controller";

@Module({
  imports: [TerminusModule, DatabaseModule, ConfigModule],
  controllers: [HealthController],
  providers: [
    {
      provide: REDIS,
      inject: [ConfigService],
      // Its own connection, so a check never queues behind throttling traffic.
      useFactory: (configService: ConfigService): Redis =>
        new Redis({
          ...configService.get<RedisOptions>("redis"),
          lazyConnect: true,
          maxRetriesPerRequest: 1,
        }),
    },
  ],
})
export class HealthModule implements OnApplicationShutdown {
  constructor(@Inject(REDIS) private redis: Redis) {}

  onApplicationShutdown(): void {
    this.redis.disconnect();
  }
}
