import express from 'express';
import request from 'supertest';
import skipTimes from '../../src/routes/skip_times';
import db from '../../src/db';
import { skipTimesInsertNoDefaultsQuery } from '../../src/db/db_queries';

const app = express();

app.use(express.json());

const router = express.Router();
router.use('/skip-times', skipTimes);

app.use('/api/v1', router);

afterAll(() => db.close());

describe('GET /api/v1/skip-times', () => {
  beforeAll(async () => {
    await db.query(skipTimesInsertNoDefaultsQuery, [
      '6d1c118e-0484-4b92-82df-896efdcba26e',
      1,
      1,
      'ProviderName',
      'op',
      10000,
      21.5,
      112.25,
      1445.17,
      '2021-02-19 01:48:41.338418',
      'e93e3787-3071-4d1f-833f-a78755702f6b',
    ]);

    await db.query(skipTimesInsertNoDefaultsQuery, [
      '23ee993a-fdf5-44eb-b4f9-cb79c7935033',
      1,
      1,
      'ProviderName',
      'ed',
      10000,
      1349.5,
      1440.485,
      1445.1238,
      '2021-02-19 01:48:41.338418',
      'e93e3787-3071-4d1f-833f-a78755702f6b',
    ]);
  });

  it('responds with an opening skip time', (done) => {
    request(app)
      .get('/api/v1/skip-times/1/1')
      .query({ type: 'op' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        found: true,
        result: {
          interval: {
            start_time: 21.5,
            end_time: 112.25,
          },
          skip_type: 'op',
          skip_id: '6d1c118e-0484-4b92-82df-896efdcba26e',
          episode_length: 1445.17,
        },
      })
      .expect(200, done);
  });

  it('responds with an ending skip time', (done) => {
    request(app)
      .get('/api/v1/skip-times/1/1')
      .query({ type: 'ed' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        found: true,
        result: {
          interval: {
            start_time: 1349.5,
            end_time: 1440.485,
          },
          skip_type: 'ed',
          skip_id: '23ee993a-fdf5-44eb-b4f9-cb79c7935033',
          episode_length: 1445.1238,
        },
      })
      .expect(200, done);
  });

  it('responds with no skip time', (done) => {
    request(app)
      .get(`/api/v1/skip-times/2/1`)
      .query({ type: 'op' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({ found: false })
      .expect(200, done);
  });

  it('responds with an episode number error', (done) => {
    request(app)
      .get(`/api/v1/skip-times/1/0`)
      .query({ type: 'op' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      })
      .expect(400, done);
  });

  it('responds with skip type error', (done) => {
    request(app)
      .get(`/api/v1/skip-times/1/1`)
      .query({ type: 'asdfasdf' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      })
      .expect(400, done);
  });

  it('responds with anime id error', (done) => {
    request(app)
      .get(`/api/v1/skip-times/0/1`)
      .query({ type: 'op' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      })
      .expect(400, done);
  });
});
