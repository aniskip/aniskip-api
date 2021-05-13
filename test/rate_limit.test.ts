import express from 'express';
import rateLimit from 'express-rate-limit';
import request from 'supertest';
import { errorHandler, notFoundError } from '../src/middlewares';
import { getStore, handler } from '../src/rate_limit';
import redisClient from '../src/redis';

const app = express();

app.use(express.json());

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

afterAll(() => redisClient.quit());

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
