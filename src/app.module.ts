import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { config } from './config';
import { PostgresModule } from './postgres';
import { RelationRulesModule } from './relation-rules';
import { SkipTimesModule } from './skip-times';
import { MorganMiddleware } from './utils';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: new ThrottlerStorageRedisService(configService.get('redis')),
      }),
    }),
    PostgresModule,
    SkipTimesModule,
    RelationRulesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
