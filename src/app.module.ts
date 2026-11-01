import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { minutes, ThrottlerModule } from '@nestjs/throttler';
import { MorganMiddleware } from './common/middleware/morgan.middleware';
import { config } from './config/configuration';
import { HealthModule } from './health/health.module';
import { RelationRulesModule } from './relation-rules/relation-rules.module';
import { SkipTimesModule } from './skip-times/skip-times.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Default for ThrottlerGuard routes; each route sets its own with @Throttle.
        throttlers: [{ ttl: minutes(1), limit: 120 }],
        storage: new ThrottlerStorageRedisService(configService.get('redis')),
      }),
    }),
    SkipTimesModule,
    HealthModule,
    RelationRulesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MorganMiddleware).forRoutes('{*path}');
  }
}
