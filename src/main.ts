import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import packageJson from '../package.json';
import { AppModule } from './app.module';
import { setupDocs } from './docs/docs';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Add middlewares.
  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
  // Express 5 defaults to the simple parser, which doesn't turn `types[]=op`
  // into an array.
  app.set('query parser', 'extended');
  app.enableCors({ origin: '*' });
  app.use(helmet());

  // OpenAPI document, served by setupDocs.
  const config = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    // Relative, so "Try it out" calls whichever host serves the docs.
    .addServer('/')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  setupDocs(app, document);

  await app.listen(Number(process.env.PORT ?? 5100));
}
bootstrap();
