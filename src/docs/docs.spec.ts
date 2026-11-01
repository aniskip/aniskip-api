import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { HttpStatus, Module } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test } from '@nestjs/testing';
import helmet from 'helmet';
import request from 'supertest';
import { setupDocs } from './docs';

@Module({})
class EmptyModule {}

describe('setupDocs', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [EmptyModule],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();
    app.use(helmet());
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('test').build(),
    );
    setupDocs(app, document);
    await app.init();
  });

  it('should redirect / to /docs temporarily', async () => {
    const res = await request(app.getHttpServer()).get('/');
    expect(res.status).toBe(HttpStatus.FOUND);
    expect(res.headers.location).toBe('/docs');
  });

  it.each([
    ['/api-docs', '/docs'],
    ['/api-docs/', '/docs'],
    ['/api-docs/swagger-ui-init.js', '/docs'],
    ['/api-docs-json', '/openapi.json'],
  ])('should redirect %s to %s permanently', async (from, to) => {
    const res = await request(app.getHttpServer()).get(from);
    expect(res.status).toBe(HttpStatus.MOVED_PERMANENTLY);
    expect(res.headers.location).toBe(to);
  });

  it('should serve the OpenAPI document uncached', async () => {
    const res = await request(app.getHttpServer()).get('/openapi.json');
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.headers['cache-control']).toBe('no-cache');
    expect(res.body.info.title).toBe('test');
  });

  it('should serve the docs page with a nonce matching its CSP', async () => {
    const res = await request(app.getHttpServer()).get('/docs');
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.headers['cache-control']).toBe('no-cache');

    const csp = res.headers['content-security-policy'] ?? '';
    const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
    expect(nonce).toBeDefined();
    expect(res.text).toContain(`nonce="${nonce}"`);
  });

  it('should use a new nonce on every request', async () => {
    const nonceOf = async (): Promise<string | undefined> => {
      const res = await request(app.getHttpServer()).get('/docs');
      return (res.headers['content-security-policy'] ?? '').match(
        /'nonce-([^']+)'/,
      )?.[1];
    };
    expect(await nonceOf()).not.toBe(await nonceOf());
  });

  it('should keep the strict CSP on other routes', async () => {
    const res = await request(app.getHttpServer()).get('/openapi.json');
    expect(res.headers['content-security-policy']).toContain(
      "script-src 'self';",
    );
  });

  it('should serve the favicon', async () => {
    const res = await request(app.getHttpServer()).get('/favicon.ico');
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.headers['content-type']).toContain('icon');
  });

  afterAll(async () => {
    await app.close();
  });
});
