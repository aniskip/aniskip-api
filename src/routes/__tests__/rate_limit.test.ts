import express, { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import request from 'supertest';

import { errorHandler, notFoundError } from '../../middlewares';
import { getStore, handler } from '../../rate_limit';

const app = express();

app.use(express.json() as RequestHandler);

app.get(
  '/v1',
  rateLimit({
    store: getStore(),
    max: 1,
    handler,
  }),
  (_req, res) => {
    res.status(200);
    res.json({ message: 'hello world' });
  }
);

app.use(notFoundError);
app.use(errorHandler);

describe('GET /v1', () => {
  it('responds with hello world', (done) => {
    request(app)
      .get('/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        const { body } = res;
        expect(body.message).toBe('hello world');
      })
      .expect(200, done);
  });

  it('responds with a rate limit error', (done) => {
    request(app)
      .get('/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        const { body } = res;
        expect(body.error).toBe('Too many requests, please try again later');
        expect(body.stacktrace).toBeDefined();
      })
      .expect(429, done);
  });
});
