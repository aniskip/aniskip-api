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
        stream: {
          write: (str) => this.logger.log(str.trimEnd()),
        },
      },
    )(req, res, next);
  }
}
