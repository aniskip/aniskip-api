import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import { DataType, IBackup, IMemoryDb, newDb } from 'pg-mem';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseSkipTime, SkipTypeV1 } from '../../skip-times';
import { SkipTimesRepository } from '../skip-times.repository';

describe('SkipTimesService', () => {
  let database: IMemoryDb;
  let databaseBackup: IBackup;
  let skipTimesRepository: SkipTimesRepository;

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

      ${/* migration 1 */ ''}

      ALTER TABLE skip_times
        DROP CONSTRAINT check_type;

      ALTER TABLE skip_times
        ADD CONSTRAINT check_type CHECK (skip_type IN ('op', 'ed', 'mixed-op', 'mixed-ed', 'recap'));

      ALTER TABLE skip_times
        ALTER COLUMN skip_type TYPE VARCHAR(32) SET NOT NULL;

      ALTER TABLE skip_times
        ALTER COLUMN skip_type SET NOT NULL;
    `);

    databaseBackup = database.backup();
  });

  beforeEach(async () => {
    const MockPool = database.adapters.createPg().Pool;

    const mockPoolProvider = {
      provide: Pool,
      useValue: new MockPool(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [mockPoolProvider, SkipTimesRepository],
    }).compile();

    skipTimesRepository = module.get<SkipTimesRepository>(SkipTimesRepository);
  });

  it('should be defined', () => {
    expect(skipTimesRepository).toBeDefined();
  });

  describe('upvoteSkipTime', () => {
    beforeAll(() => {
      databaseBackup.restore();

      database.public.none(`
        INSERT INTO skip_times
          VALUES ('c9dfd857-0351-4a90-b37e-582a44253910', 1, 1, 'ProviderName', 'op', 0, 208, 298.556, 1435.122, '2021-02-19 02:14:22.872759', 'e93e3787-3071-4d1f-833f-a78755702f6b');
      `);
    });

    it('should upvote a skip time', async () => {
      const isSuccessful = await skipTimesRepository.upvoteSkipTime(
        'c9dfd857-0351-4a90-b37e-582a44253910'
      );

      expect(isSuccessful).toBeTruthy();
    });

    it('should not upvote successfully', async () => {
      const isSuccessful = await skipTimesRepository.upvoteSkipTime(
        'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
      );

      expect(isSuccessful).toBeFalsy();
    });
  });

  describe('downvoteSkipTime', () => {
    beforeAll(() => {
      databaseBackup.restore();

      database.public.none(`
        INSERT INTO skip_times
          VALUES ('c9dfd857-0351-4a90-b37e-582a44253910', 1, 1, 'ProviderName', 'op', 0, 208, 298.556, 1435.122, '2021-02-19 02:14:22.872759', 'e93e3787-3071-4d1f-833f-a78755702f6b');
      `);
    });

    it('should downvote a skip time', async () => {
      const isSuccessful = await skipTimesRepository.downvoteSkipTime(
        'c9dfd857-0351-4a90-b37e-582a44253910'
      );

      expect(isSuccessful).toBeTruthy();
    });

    it('should not downvote successfully', async () => {
      const isSuccessful = await skipTimesRepository.downvoteSkipTime(
        'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
      );

      expect(isSuccessful).toBeFalsy();
    });
  });

  describe('createSkipTime', () => {
    const testSkipTime: Omit<DatabaseSkipTime, 'skip_id' | 'submit_date'> = {
      anime_id: 3,
      end_time: 128.1,
      episode_length: 1440.05,
      episode_number: 2,
      provider_name: 'ProviderName',
      skip_type: 'op' as SkipTypeV1,
      start_time: 37.75,
      submitter_id: 'efb943b4-6869-4179-b3a6-81c5d97cf98b',
      votes: 0,
    };

    beforeEach(() => {
      databaseBackup.restore();
    });

    it('should create a skip time', async () => {
      const skipId = await skipTimesRepository.createSkipTime(testSkipTime);
      const skipTime = database.public.one(`
        SELECT
          *
        FROM
          skip_times
        WHERE
          skip_id = '${skipId}';
      `) as DatabaseSkipTime;

      expect(skipId).toBeDefined();
      expect(skipTime.anime_id).toBe(testSkipTime.anime_id);
      expect(skipTime.episode_number).toBe(testSkipTime.episode_number);
      expect(skipTime.provider_name).toBe(testSkipTime.provider_name);
      expect(skipTime.skip_type).toBe(testSkipTime.skip_type);
      expect(skipTime.votes).toBe(testSkipTime.votes);
      expect(skipTime.start_time).toBe(testSkipTime.start_time);
      expect(skipTime.end_time).toBe(testSkipTime.end_time);
      expect(skipTime.episode_length).toBe(testSkipTime.episode_length);
      expect(skipTime.submitter_id).toBe(testSkipTime.submitter_id);
      expect(skipTime.skip_id).toBeDefined();
      expect(skipTime.submit_date).toBeDefined();
    });

    it.skip('should throw episode number constraint violation', async () => {
      const invalidSkipTime: Omit<DatabaseSkipTime, 'skip_id' | 'submit_date'> =
        {
          ...testSkipTime,
          episode_number: 0,
        };

      await expect(
        skipTimesRepository.createSkipTime(invalidSkipTime)
      ).rejects.toThrow();
    });

    it('should throw skip type constraint violation', async () => {
      const invalidSkipTime: Omit<DatabaseSkipTime, 'skip_id' | 'submit_date'> =
        {
          ...testSkipTime,
          skip_type: 'wrong' as SkipTypeV1,
        };

      await expect(
        skipTimesRepository.createSkipTime(invalidSkipTime)
      ).rejects.toThrow();
    });

    it.skip('should throw start time constraint violation', async () => {
      const invalidSkipTime: Omit<DatabaseSkipTime, 'skip_id' | 'submit_date'> =
        {
          ...testSkipTime,
          start_time: -1,
        };

      await expect(
        skipTimesRepository.createSkipTime(invalidSkipTime)
      ).rejects.toThrow();
    });

    it.skip('should throw end time constraint violation', async () => {
      const invalidSkipTime: Omit<DatabaseSkipTime, 'skip_id' | 'submit_date'> =
        {
          ...testSkipTime,
          episode_length: 0,
        };

      await expect(
        skipTimesRepository.createSkipTime(invalidSkipTime)
      ).rejects.toThrow();
    });

    it.skip('should throw episode length constraint violation', async () => {
      const invalidSkipTime: Omit<DatabaseSkipTime, 'skip_id' | 'submit_date'> =
        {
          ...testSkipTime,
          episode_length: -1,
        };

      await expect(
        skipTimesRepository.createSkipTime(invalidSkipTime)
      ).rejects.toThrow();
    });

    it('should throw submitter id constraint violation', async () => {
      const invalidSkipTime: Omit<DatabaseSkipTime, 'skip_id' | 'submit_date'> =
        {
          ...testSkipTime,
          submitter_id: '1',
        };

      await expect(
        skipTimesRepository.createSkipTime(invalidSkipTime)
      ).rejects.toThrow();
    });
  });

  describe('findSkipTimes', () => {
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

    it('should return an opening skip time', async () => {
      const skipTime = await skipTimesRepository.findSkipTimes(1, 1, 'op');

      expect(skipTime).toEqual([
        {
          interval: {
            startTime: 21.5,
            endTime: 112.25,
          },
          skipType: 'op',
          skipId: '6d1c118e-0484-4b92-82df-896efdcba26e',
          episodeLength: 1445.17,
        },
      ]);
    });

    it('should return an ending skip time', async () => {
      const skipTime = await skipTimesRepository.findSkipTimes(1, 1, 'ed');

      expect(skipTime).toEqual([
        {
          interval: {
            startTime: 1349.5,
            endTime: 1440.485,
          },
          skipType: 'ed',
          skipId: '23ee993a-fdf5-44eb-b4f9-cb79c7935033',
          episodeLength: 1445.1238,
        },
      ]);
    });

    it('should return no skip time', async () => {
      const skipTime = await skipTimesRepository.findSkipTimes(2, 1, 'ed');

      expect(skipTime).toEqual([]);
    });
  });

  describe('getAverageOfLastTenSkipTimesVotes', () => {
    beforeEach(() => {
      databaseBackup.restore();
    });

    it('should return the average of two skip times', async () => {
      database.public.none(`
        INSERT INTO skip_times
          VALUES ('c9dfd857-0351-4a90-b37e-582a44253912', 1, 1, 'ProviderName', 'op', 3, 208, 298.556, 1435.122, '2021-02-19 02:14:22.872759', 'e93e3787-3071-4d1f-833f-a78755702f6b');
      `);

      database.public.none(`
        INSERT INTO skip_times
          VALUES ('c9dfd857-0351-4a90-b37e-582a44253911', 1, 1, 'ProviderName', 'op', 4, 208, 298.556, 1435.122, '2021-02-19 02:14:22.872759', 'e93e3787-3071-4d1f-833f-a78755702f6b');
      `);

      const average =
        await skipTimesRepository.getAverageOfLastTenSkipTimesVotes(
          'e93e3787-3071-4d1f-833f-a78755702f6b'
        );

      expect(average).toBe(3.5);
    });

    it('should return zero from a user with zero submitted skip times', async () => {
      const average =
        await skipTimesRepository.getAverageOfLastTenSkipTimesVotes(
          'e93e3787-3071-4d1f-833f-a78755702f6b'
        );

      expect(average).toBe(0);
    });
  });
});
