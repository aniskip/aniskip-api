import { randomBytes } from 'node:crypto';
import type { ServerResponse } from 'node:http';
import path from 'node:path';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { type OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import type { Request, Response } from 'express';
import helmet from 'helmet';

// Pinned, so the docs don't change under us when Scalar publishes.
const SCALAR_CDN = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.75.0';
const SCALAR_SERVICES = 'https://*.scalar.com';

const FAVICON = path.join(__dirname, '..', 'public', 'favicon.ico');

// Revalidate on every request, so the docs never go stale behind Cloudflare
// after a deploy.
const noCache = (res: Response): void => {
  res.set('Cache-Control', 'no-cache');
};

const nonceOf = (res: ServerResponse): string =>
  (res as Response).locals.cspNonce;

/**
 * Serves the API reference (Scalar) at /docs and the OpenAPI document at
 * /openapi.json. The old Swagger UI paths redirect to them.
 */
export function setupDocs(
  app: NestExpressApplication,
  document: OpenAPIObject,
): void {
  const server = app.getHttpAdapter().getInstance();

  server.get('/favicon.ico', (_req, res) => {
    res.sendFile(FAVICON, { maxAge: '1d' });
  });

  server.get('/openapi.json', (_req, res, next) => {
    noCache(res);
    next();
  });
  SwaggerModule.setup('docs', app, document, {
    ui: false,
    raw: ['json'],
    jsonDocumentUrl: '/openapi.json',
  });

  server.get(
    '/docs',
    (_req, res, next) => {
      res.locals.cspNonce = randomBytes(16).toString('base64');
      next();
    },
    // The page loads Scalar from the CDN and starts it with an inline script,
    // and its hosted features (telemetry, AI agent, request proxy) call
    // *.scalar.com. Allow exactly those on this page; every other route keeps
    // helmet's default policy.
    helmet.contentSecurityPolicy({
      directives: {
        scriptSrc: [
          "'self'",
          SCALAR_CDN,
          (_req, res) => `'nonce-${nonceOf(res)}'`,
        ],
        connectSrc: ["'self'", SCALAR_SERVICES],
        imgSrc: ["'self'", 'data:', SCALAR_SERVICES],
      },
    }),
    (req: Request, res: Response) => {
      noCache(res);
      const render = apiReference({
        url: '/openapi.json',
        cdn: SCALAR_CDN,
        nonce: res.locals.cspNonce,
        pageTitle: 'Aniskip API',
        favicon: '/favicon.ico',
      }) as (req: Request, res: Response) => void;
      render(req, res);
    },
  );

  server.get(['/api-docs', '/api-docs/{*path}'], (_req, res) => {
    res.redirect(301, '/docs');
  });
  server.get('/api-docs-json', (_req, res) => {
    res.redirect(301, '/openapi.json');
  });
}
