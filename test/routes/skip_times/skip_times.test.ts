import express from 'express';
import request from 'supertest';

import { skipTimesInsertNoDefaultsQuery } from '../../../src/db/queries';
import { errorHandler, notFoundError } from '../../../src/middlewares';
import skipTimes from '../../../src/routes/skip_times';
import db from '../../../src/db';

const app = express();

app.use(express.json());

const router = express.Router();

router.use('/skip-times', skipTimes);

app.use('/v1', router);
app.get('/test-internal-server-error', () => {
  throw new Error('internal server error');
});
app.use(notFoundError);
app.use(errorHandler);

afterAll(() => {
  db.close();
});

describe('GET /v1', () => {
  it('responds with a not found error', (done) => {
    request(app)
      .get('/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        const { body } = res;
        expect(body.error).toBe("Not found '/v1'");
        expect(body.stacktrace).toBeDefined();
      })
      .expect(404, done);
  });

  it('responds with an internal server error', (done) => {
    request(app)
      .get('/test-internal-server-error')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        const { body } = res;
        expect(body.error).toBe('internal server error');
        expect(body.stacktrace).toBeDefined();
      })
      .expect(500, done);
  });
});

describe('POST /v1/skip-times/vote/{skip_id}', () => {
  beforeAll(() =>
    db.query(skipTimesInsertNoDefaultsQuery, [
      'c9dfd857-0351-4a90-b37e-582a44253910',
      1,
      1,
      'ProviderName',
      'op',
      0,
      208,
      298.556,
      1435.122,
      '2021-02-19 02:14:22.872759',
      'e93e3787-3071-4d1f-833f-a78755702f6b',
    ])
  );

  it('responds with success', (done) => {
    request(app)
      .post('/v1/skip-times/vote/c9dfd857-0351-4a90-b37e-582a44253910')
      .send({ vote_type: 'upvote' })
      .set('Accept', 'application/json')
      .expect({ message: 'success' })
      .expect(200, done);
  });

  it('responds with success', (done) => {
    request(app)
      .post('/v1/skip-times/vote/c9dfd857-0351-4a90-b37e-582a44253910')
      .send({ vote_type: 'downvote' })
      .set('Accept', 'application/json')
      .expect({ message: 'success' })
      .expect(200, done);
  });

  it('responds with no skip time found error', (done) => {
    request(app)
      .post('/v1/skip-times/vote/6d1c118e-0484-4b92-82df-896efdcba26f')
      .send({ vote_type: 'upvote' })
      .set('Accept', 'application/json')
      .expect({
        error: [
          {
            value: '6d1c118e-0484-4b92-82df-896efdcba26f',
            msg: 'Skip time not found',
            param: 'skip_id',
            location: 'params',
          },
        ],
      })
      .expect(404, done);
  });

  it('responds with invalid vote type error', (done) => {
    request(app)
      .post('/v1/skip-times/vote/c9dfd857-0351-4a90-b37e-582a44253910')
      .send({ vote_type: 'wrong' })
      .set('Accept', 'application/json')
      .expect({
        error: [
          {
            value: 'wrong',
            msg: 'Invalid value',
            param: 'vote_type',
            location: 'body',
          },
        ],
      })
      .expect(400, done);
  });

  it('responds with invalid skip id error', (done) => {
    request(app)
      .post('/v1/skip-times/vote/1')
      .send({ vote_type: 'upvote' })
      .set('Accept', 'application/json')
      .expect({
        error: [
          {
            value: '1',
            msg: 'Invalid value',
            param: 'skip_id',
            location: 'params',
          },
        ],
      })
      .expect(400, done);
  });
});

describe('GET /v1/skip-times/{anime_id}/{episode_number}', () => {
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
      .get('/v1/skip-times/1/1')
      .query({ types: 'op' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        found: true,
        results: [
          {
            interval: {
              start_time: 21.5,
              end_time: 112.25,
            },
            skip_type: 'op',
            skip_id: '6d1c118e-0484-4b92-82df-896efdcba26e',
            episode_length: 1445.17,
          },
        ],
      })
      .expect(200, done);
  });

  it('responds with an ending skip time', (done) => {
    request(app)
      .get('/v1/skip-times/1/1')
      .query({ types: 'ed' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        found: true,
        results: [
          {
            interval: {
              start_time: 1349.5,
              end_time: 1440.485,
            },
            skip_type: 'ed',
            skip_id: '23ee993a-fdf5-44eb-b4f9-cb79c7935033',
            episode_length: 1445.1238,
          },
        ],
      })
      .expect(200, done);
  });

  it('responds with an opening and ending skip time', (done) => {
    request(app)
      .get('/v1/skip-times/1/1')
      .query({ types: ['op', 'ed'] })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        found: true,
        results: [
          {
            interval: {
              start_time: 21.5,
              end_time: 112.25,
            },
            skip_type: 'op',
            skip_id: '6d1c118e-0484-4b92-82df-896efdcba26e',
            episode_length: 1445.17,
          },
          {
            interval: {
              start_time: 1349.5,
              end_time: 1440.485,
            },
            skip_type: 'ed',
            skip_id: '23ee993a-fdf5-44eb-b4f9-cb79c7935033',
            episode_length: 1445.1238,
          },
        ],
      })
      .expect(200, done);
  });

  it('responds with no skip time', (done) => {
    request(app)
      .get('/v1/skip-times/2/1')
      .query({ types: 'op' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({ found: false, results: [] })
      .expect(200, done);
  });

  it('responds with an episode number error', (done) => {
    request(app)
      .get('/v1/skip-times/1/0')
      .query({ types: 'op' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        error: [
          {
            value: '0',
            msg: 'Invalid value',
            param: 'episode_number',
            location: 'params',
          },
        ],
      })
      .expect(400, done);
  });

  it('responds with skip type error', (done) => {
    request(app)
      .get('/v1/skip-times/1/1')
      .query({ types: 'wrong' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        error: [
          {
            value: ['wrong'],
            msg: "Invalid values 'wrong'",
            param: 'types',
            location: 'query',
          },
        ],
      })
      .expect(400, done);
  });

  it('responds with anime id error', (done) => {
    request(app)
      .get('/v1/skip-times/0/1')
      .query({ types: 'op' })
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

  it('responds with an invalid types error', (done) => {
    request(app)
      .get('/v1/skip-times/1/1')
      .query({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        error: [
          {
            msg: 'Invalid value',
            param: 'types',
            location: 'query',
          },
        ],
      })
      .expect(400, done);
  });

  it('responds with duplicate types error', (done) => {
    request(app)
      .get('/v1/skip-times/1/1')
      .query({ types: ['op', 'op'] })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        error: [
          {
            value: ['op', 'op'],
            msg: 'Duplicate types',
            param: 'types',
            location: 'query',
          },
        ],
      })
      .expect(400, done);
  });
});

describe('POST /v1/skip-times/{anime_id}/{episode_number}', () => {
  it('responds with success', (done) => {
    request(app)
      .post('/v1/skip-times/3/2')
      .send({
        skip_type: 'op',
        provider_name: 'ProviderName',
        start_time: 37.75,
        end_time: 128.1,
        episode_length: 1440.05,
        submitter_id: 'efb943b4-6869-4179-b3a6-81c5d97cf98b',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        const { body } = res;
        expect(body.message).toBe('success');
        expect(body.skip_id).toBeDefined();
      })
      .expect(200, done);
  });

  it('responds with success', (done) => {
    request(app)
      .post('/v1/skip-times/3/2')
      .send({
        skip_type: 'ed',
        provider_name: 'ProviderName',
        start_time: 1334.75,
        end_time: 1425,
        episode_length: 1440.0038,
        submitter_id: 'efb943b4-6869-4179-b3a6-81c5d97cf98b',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        const { body } = res;
        expect(body.message).toBe('success');
        expect(body.skip_id).toBeDefined();
      })
      .expect(200, done);
  });

  it('responds with an opening skip time', (done) => {
    request(app)
      .get('/v1/skip-times/3/2')
      .query({ types: 'op' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        const { found, results } = res.body;
        expect(found).toBe(true);
        expect(results[0].interval).toMatchObject({
          start_time: 37.75,
          end_time: 128.1,
        });
        expect(results[0].skip_type).toBe('op');
        expect(results[0].skip_id).toBeDefined();
        expect(results[0].episode_length).toBeCloseTo(1440.05);
      })
      .expect(200, done);
  });

  it('responds with an opening skip time', (done) => {
    request(app)
      .get('/v1/skip-times/3/2')
      .query({ types: 'ed' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        const { found, results } = res.body;
        expect(found).toBe(true);
        expect(results[0].interval).toMatchObject({
          start_time: 1334.75,
          end_time: 1425,
        });
        expect(results[0].skip_type).toBe('ed');
        expect(results[0].skip_id).toBeDefined();
        expect(results[0].episode_length).toBeCloseTo(1440.0038);
      })
      .expect(200, done);
  });

  it('responds with an anime id error', (done) => {
    request(app)
      .post('/v1/skip-times/0/2')
      .send({
        skip_type: 'ed',
        provider_name: 'ProviderName',
        start_time: 1334.75,
        end_time: 1425,
        episode_length: 1440.0038,
        submitter_id: 'efb943b4-6869-4179-b3a6-81c5d97cf98b',
      })
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

  it('responds with episode number error', (done) => {
    request(app)
      .post('/v1/skip-times/3/0')
      .send({
        skip_type: 'ed',
        provider_name: 'ProviderName',
        start_time: 1334.75,
        end_time: 1425,
        episode_length: 1440.0038,
        submitter_id: 'efb943b4-6869-4179-b3a6-81c5d97cf98b',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        error: [
          {
            value: '0',
            msg: 'Invalid value',
            param: 'episode_number',
            location: 'params',
          },
        ],
      })
      .expect(400, done);
  });

  it('responds with skip type error', (done) => {
    request(app)
      .post('/v1/skip-times/3/2')
      .send({
        skip_type: 'wrong',
        provider_name: 'ProviderName',
        start_time: 1334.75,
        end_time: 1425,
        episode_length: 1440.0038,
        submitter_id: 'efb943b4-6869-4179-b3a6-81c5d97cf98b',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        error: [
          {
            value: 'wrong',
            msg: 'Invalid value',
            param: 'skip_type',
            location: 'body',
          },
        ],
      })
      .expect(400, done);
  });

  it('responds with a start time error', (done) => {
    request(app)
      .post('/v1/skip-times/3/2')
      .send({
        skip_type: 'ed',
        provider_name: 'ProviderName',
        start_time: -1,
        end_time: 1425,
        episode_length: 1440.0038,
        submitter_id: 'efb943b4-6869-4179-b3a6-81c5d97cf98b',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        error: [
          {
            value: -1,
            msg: 'Invalid value',
            param: 'start_time',
            location: 'body',
          },
        ],
      })
      .expect(400, done);
  });

  it('responds with an end time constraint error', (done) => {
    request(app)
      .post('/v1/skip-times/3/2')
      .send({
        skip_type: 'ed',
        provider_name: 'ProviderName',
        start_time: 1334.75,
        end_time: 0,
        episode_length: 1440.0038,
        submitter_id: 'efb943b4-6869-4179-b3a6-81c5d97cf98b',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      })
      .expect(400, done);
  });

  it('responds with end time constraint error', (done) => {
    request(app)
      .post('/v1/skip-times/3/2')
      .send({
        skip_type: 'ed',
        provider_name: 'ProviderName',
        start_time: 1334.75,
        end_time: 1425,
        episode_length: 0,
        submitter_id: 'efb943b4-6869-4179-b3a6-81c5d97cf98b',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
      })
      .expect(400, done);
  });

  it('responds with an episode length error', (done) => {
    request(app)
      .post('/v1/skip-times/3/2')
      .send({
        skip_type: 'ed',
        provider_name: 'ProviderName',
        start_time: 1334.75,
        end_time: 1425,
        episode_length: -1,
        submitter_id: 'efb943b4-6869-4179-b3a6-81c5d97cf98b',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        error: [
          {
            value: -1,
            msg: 'Invalid value',
            param: 'episode_length',
            location: 'body',
          },
        ],
      })
      .expect(400, done);
  });

  it('responds with submitter id error', (done) => {
    request(app)
      .post('/v1/skip-times/3/2')
      .send({
        skip_type: 'ed',
        provider_name: 'ProviderName',
        start_time: 1334.75,
        end_time: 1425,
        episode_length: 1440.0038,
        submitter_id: '1',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({
        error: [
          {
            value: '1',
            msg: 'Invalid value',
            param: 'submitter_id',
            location: 'body',
          },
        ],
      })
      .expect(400, done);
  });
});
