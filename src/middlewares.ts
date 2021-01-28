import { Request, Response } from 'express';

export const notFoundError = (
  req: Request,
  res: Response,
  next: CallableFunction
) => {
  res.status(404);
  const error = new Error(`Not found '${req.originalUrl}'`);
  next(error);
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: CallableFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stacktrace: error.stack }),
  });
};
