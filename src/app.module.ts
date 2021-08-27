import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { poolConfig, PostgresModule } from './postgres';
import { RelationRulesModule } from './relation-rules';
import { SkipTimesModule } from './skip-times';
import { MorganMiddleware } from './utils';
import { redisConfig } from './redis';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      storage: new ThrottlerStorageRedisService(redisConfig),
    }),
    PostgresModule.forRoot(poolConfig),
    SkipTimesModule,
    RelationRulesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
