import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
  app.enableCors({ origin: '*' });
  app.use(helmet());
  await app.listen(5000);
}
bootstrap();
