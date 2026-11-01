import { Injectable, Logger, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  private logger = new Logger(MorganMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    morgan(
      ':remote-addr ":method :url HTTP/:http-version" :status :res[content-length]',
      {
        // Docker checks /health every 30 s; only log it when it fails.
        skip: (request, response) =>
          request.url === '/health' && response.statusCode < 400,
        stream: {
          write: (str) => this.logger.log(str.trimEnd()),
        },
      },
    )(req, res, next);
  }
}
