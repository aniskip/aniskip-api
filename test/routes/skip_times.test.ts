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

beforeAll(() =>
  db.query(skipTimesInsertNoDefaultsQuery, [
    '6d1c118e-0484-4b92-82df-896efdcba26e',
    '0',
    '1',
    'ProviderName',
    'op',
    '10000',
    '21.5',
    '112.25',
    '1445.17',
    '2021-02-19 01:48:41.338418',
    'e93e3787-3071-4d1f-833f-a78755702f6b',
  ])
);

afterAll(() => db.close());

describe('GET /api/v1/skip-times', () => {
  it('responds with a skip time', async () =>
    request(app)
      .get('/api/v1/skip-times/0/1')
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
      .expect(200));
});
