import express, { RequestHandler } from 'express';
import request from 'supertest';

import rules from '../../src/routes/rules';

const app = express();

app.use(express.json() as RequestHandler);

const router = express.Router();

router.use('/rules', rules);

app.use('/v1', router);

describe('GET /v1/rules', () => {
  it('responds invalid anime_id parameter', (done) => {
    request(app)
      .get('/v1/rules/0')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        error: [
          {
            value: '0',
            msg: 'Invalid value',
            param: 'anime_id',
            location: 'params',
          },
        ],
      })
      .expect(400, done);
  });

  it('responds with no rules', (done) => {
    request(app)
      .get('/v1/rules/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        found: false,
        rules: [],
      })
      .expect(200, done);
  });

  it('responds with a single episode rule', (done) => {
    request(app)
      .get('/v1/rules/6682')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        found: true,
        rules: [
          {
            from: {
              start: 13,
              end: 13,
            },
            to: {
              malId: 7739,
              start: 1,
              end: 1,
            },
          },
        ],
      })
      .expect(200, done);
  });

  it('responds with a single episode rule', (done) => {
    request(app)
      .get('/v1/rules/18153')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        found: true,
        rules: [
          {
            from: { start: 0, end: 0 },
            to: { malId: 23385, start: 1, end: 1 },
          },
        ],
      })
      .expect(200, done);
  });

  it('responds with range rule', (done) => {
    request(app)
      .get('/v1/rules/31646')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        found: true,
        rules: [
          {
            from: {
              start: 23,
              end: 44,
            },
            to: {
              malId: 35180,
              start: 1,
              end: 22,
            },
          },
        ],
      })
      .expect(200, done);
  });

  it('responds with self redirecting rule', (done) => {
    request(app)
      .get('/v1/rules/31580')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        found: true,
        rules: [
          {
            from: {
              start: 14,
              end: 26,
            },
            to: {
              malId: 33253,
              start: 1,
              end: 13,
            },
          },
        ],
      })
      .expect(200, done);
  });

  it('responds with a rule with an unknown ending range', (done) => {
    request(app)
      .get('/v1/rules/37178')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        found: true,
        rules: [
          {
            from: {
              start: 52,
              end: 102,
            },
            to: {
              malId: 38804,
              start: 1,
              end: 51,
            },
          },
          {
            from: {
              start: 103,
            },
            to: {
              malId: 40880,
              start: 1,
            },
          },
        ],
      })
      .expect(200, done);
  });
});
