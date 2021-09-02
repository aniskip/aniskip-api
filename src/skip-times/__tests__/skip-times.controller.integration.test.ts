import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { Pool } from 'pg';
import { DataType, IBackup, IMemoryDb, newDb } from 'pg-mem';
import { v4 as uuidv4 } from 'uuid';
import * as request from 'supertest';
import { SkipTimesControllerV2 } from '../skip-times.controller';
import { SkipTimesService } from '../skip-times.service';
import { SkipTimesRepository } from '../../repositories/skip-times.repository';
import { VoteService } from '../../vote';

describe('SkipTimesController', () => {
  let app: INestApplication;
  let database: IMemoryDb;
  let databaseBackup: IBackup;

  beforeAll(async () => {
    database = newDb();

    database.public.registerFunction({
      name: 'gen_random_uuid',
      returns: DataType.uuid,
      implementation: uuidv4,
      impure: true,
    });

    database.public.none(`
      CREATE TABLE skip_times (
        skip_id uuid UNIQUE NOT NULL DEFAULT gen_random_uuid (),
        anime_id integer NOT NULL,
        episode_number real NOT NULL,
        provider_name varchar(64) NOT NULL,
        skip_type char(2) NOT NULL,
        votes integer NOT NULL DEFAULT 0,
        start_time real NOT NULL,
        end_time real NOT NULL,
        episode_length real NOT NULL,
        submit_date timestamp NOT NULL DEFAULT NOW() ::timestamp,
        submitter_id uuid NOT NULL,
        PRIMARY KEY (skip_id),
        CONSTRAINT check_type CHECK (skip_type IN ('op', 'ed')),
        CONSTRAINT check_anime_length CHECK (episode_length >= 0),
        CONSTRAINT check_start_time CHECK (start_time >= 0),
        CONSTRAINT check_anime_id CHECK (anime_id >= 0),
        CONSTRAINT check_episode_number CHECK (episode_number >= 0.5),
        CONSTRAINT check_end_time CHECK (end_time >= 0 AND end_time > start_time AND end_time <= episode_length)
      );
    `);

    databaseBackup = database.backup();

    const MockPool = database.adapters.createPg().Pool;

    const mockPoolProvider = {
      provide: Pool,
      useValue: new MockPool(),
    };

    const module = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot()],
      controllers: [SkipTimesControllerV2],
      providers: [
        mockPoolProvider,
        SkipTimesRepository,
        VoteService,
        SkipTimesService,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  describe('POST /skip-times/vote/{skipId}', () => {
    beforeAll(() => {
      databaseBackup.restore();

      database.public.none(`
        INSERT INTO skip_times
          VALUES ('c9dfd857-0351-4a90-b37e-582a44253910', 1, 1, 'ProviderName', 'op', 0, 208, 298.556, 1435.122, '2021-02-19 02:14:22.872759', 'e93e3787-3071-4d1f-833f-a78755702f6b');
      `);
    });

    it('should upvote a skip time', (done) => {
      request(app.getHttpServer())
        .post('/skip-times/vote/c9dfd857-0351-4a90-b37e-582a44253910')
        .send({ voteType: 'upvote' })
        .expect({
          statusCode: HttpStatus.CREATED,
          message: 'Successfully upvote the skip time',
        })
        .expect(HttpStatus.CREATED, done);
    });
  });

  describe('GET /skip-times/{animeId}/{episodeNumber}', () => {
    beforeAll(() => {
      databaseBackup.restore();

      database.public.none(`
        INSERT INTO skip_times
          VALUES ('6d1c118e-0484-4b92-82df-896efdcba26e', 1, 1, 'ProviderName', 'op', 10000, 21.5, 112.25, 1445.17, '2021-02-19 01:48:41.338418', 'e93e3787-3071-4d1f-833f-a78755702f6b');
      `);

      database.public.none(`
        INSERT INTO skip_times
          VALUES ('23ee993a-fdf5-44eb-b4f9-cb79c7935033', 1, 1, 'ProviderName', 'ed', 10000, 1349.5, 1440.485, 1445.1238, '2021-02-19 01:48:41.338418', 'e93e3787-3071-4d1f-833f-a78755702f6b');
      `);
    });

    it('should respond with an episode number bad request', (done) => {
      request(app.getHttpServer())
        .get('/skip-times/1/0')
        .query({ types: 'op' })
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['episodeNumber must not be less than 0.5'],
          error: 'Bad Request',
        })
        .expect(HttpStatus.BAD_REQUEST, done);
    });

    it('should respond with an opening and ending', (done) => {
      request(app.getHttpServer())
        .get('/skip-times/1/1')
        .query({ types: ['op', 'ed'] })
        .expect({
          found: true,
          results: [
            {
              interval: {
                startTime: 21.5,
                endTime: 112.25,
              },
              skipType: 'op',
              skipId: '6d1c118e-0484-4b92-82df-896efdcba26e',
              episodeLength: 1445.17,
            },
            {
              interval: {
                startTime: 1349.5,
                endTime: 1440.485,
              },
              skipType: 'ed',
              skipId: '23ee993a-fdf5-44eb-b4f9-cb79c7935033',
              episodeLength: 1445.1238,
            },
          ],
          message: 'Successfully found skip times',
          statusCode: HttpStatus.OK,
        })
        .expect(HttpStatus.OK, done);
    });
  });

  describe('POST /v1/skip-times/{animeId}/{episodeNumber}', () => {
    beforeAll(() => {
      databaseBackup.restore();
    });

    it('should create a skip time', (done) => {
      request(app.getHttpServer())
        .post('/skip-times/3/2')
        .send({
          skipType: 'op',
          providerName: 'ProviderName',
          startTime: 37.75,
          endTime: 128.1,
          episodeLength: 1440.05,
          submitterId: 'efb943b4-6869-4179-b3a6-81c5d97cf98b',
        })
        .expect((res) => {
          const { body } = res;
          expect(body.message).toBe('Successfully created a skip time');
          expect(body.skipId).toBeDefined();
          expect(body.statusCode).toBe(HttpStatus.CREATED);
        })
        .expect(HttpStatus.CREATED, done);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
