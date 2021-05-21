import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const validationHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ error: errors.array() });
  }

  return next();
};

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404);
  const error = new Error(`Not found '${req.originalUrl}'`);
  next(error);
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    error: error.message,
    ...(['development', 'test'].some(
      (environment) => process.env.NODE_ENV === environment
    ) && { stacktrace: error.stack }),
  });
};
