import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({ origin: '*' });
  app.use(helmet());
  await app.listen(5000);
}
bootstrap();
