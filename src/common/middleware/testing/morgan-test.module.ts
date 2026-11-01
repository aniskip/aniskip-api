import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common';
import { MorganMiddleware } from '../morgan.middleware';
import { MorganTestController } from './morgan-test.controller';

@Module({
  controllers: [MorganTestController],
})
export class MorganTestModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
