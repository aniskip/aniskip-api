import type { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { cleanupOpenApiDoc, ZodValidationPipe } from 'nestjs-zod';
import packageJson from '../package.json';
import { AppModule } from './app.module';
import { setupDocs } from './docs/docs';
import { RelationRulesModuleV1 } from './relation-rules/v1/relation-rules.module';
import { RelationRulesModuleV2 } from './relation-rules/v2/relation-rules.module';
import { SkipTimesModuleV1 } from './skip-times/v1/skip-times.module';
import { SkipTimesModuleV2 } from './skip-times/v2/skip-times.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Add middlewares.
  app.enableVersioning();
  app.useGlobalPipes(new ZodValidationPipe());
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
  // cleanupOpenApiDoc turns the Zod DTOs into proper OpenAPI schemas.
  // `include` limits a document to those modules' controllers.
  const createDocument = (include?: Type[]) =>
    cleanupOpenApiDoc(SwaggerModule.createDocument(app, config, { include }));
  setupDocs(app, createDocument(), {
    v2: createDocument([SkipTimesModuleV2, RelationRulesModuleV2]),
    v1: createDocument([SkipTimesModuleV1, RelationRulesModuleV1]),
  });

  await app.listen(Number(process.env.PORT ?? 5100));
}
bootstrap();
