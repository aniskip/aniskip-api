import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import { SkipType } from '../skip-times.types';
import { PostgresService } from '../../postgres';
import { SkipTimesRepository } from '../../repositories';
import { VoteService } from '../../vote';
import { SkipTimesService } from '../skip-times.service';

describe('SkipTimesService', () => {
  let skipTimesService: SkipTimesService;
  let skipTimesRepository: SkipTimesRepository;
  let voteService: VoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Pool,
        PostgresService,
        SkipTimesRepository,
        VoteService,
        SkipTimesService,
      ],
    }).compile();

    skipTimesService = module.get<SkipTimesService>(SkipTimesService);
    skipTimesRepository = module.get<SkipTimesRepository>(SkipTimesRepository);
    voteService = module.get<VoteService>(VoteService);
  });

  it('should be defined', () => {
    expect(skipTimesService).toBeDefined();
  });

  describe('voteSkipTime', () => {
    it('should upvote a skip time', async () => {
      jest
        .spyOn(skipTimesRepository, 'upvoteSkipTime')
        .mockReturnValue(Promise.resolve(true));

      const isSuccessful = await skipTimesService.voteSkipTime(
        'upvote',
        'e93e3787-3071-4d1f-833f-a78755702f6b'
      );

      expect(isSuccessful).toBeTruthy();
    });

    it('should downvote a skip time', async () => {
      jest
        .spyOn(skipTimesRepository, 'downvoteSkipTime')
        .mockReturnValue(Promise.resolve(true));

      const isSuccessful = await skipTimesService.voteSkipTime(
        'downvote',
        'e93e3787-3071-4d1f-833f-a78755702f6b'
      );

      expect(isSuccessful).toBeTruthy();
    });
  });

  describe('createSkipTime', () => {
    it('should create a skip time', async () => {
      const testSkipId = 'e93e3787-3071-4d1f-833f-a78755702f6b';

      jest
        .spyOn(skipTimesRepository, 'createSkipTime')
        .mockReturnValue(Promise.resolve(testSkipId));

      jest.spyOn(voteService, 'autoVote').mockReturnValue(Promise.resolve(0));

      const skipTime = {
        anime_id: 3,
        episode_number: 2,
        skip_type: 'op' as SkipType,
        provider_name: 'ProviderName',
        start_time: 37.75,
        end_time: 128.1,
        episode_length: 1440.05,
        submitter_id: 'efb943b4-6869-4179-b3a6-81c5d97cf98b',
      };

      const skipId = await skipTimesService.createSkipTime(skipTime);

      expect(skipId).toEqual(testSkipId);
    });
  });

  describe('findSkipTimes', () => {
    it('should return only an opening', async () => {
      const testSkipTimes = [
        {
          interval: {
            startTime: 208,
            endTime: 298.556,
          },
          skipType: 'op' as SkipType,
          skipId: 'c9dfd857-0351-4a90-b37e-582a44253910',
          episodeLength: 1435.122,
        },
        {
          interval: {
            startTime: 173.75,
            endTime: 269.39,
          },
          skipType: 'op' as SkipType,
          skipId: 'd468dafe-3e00-4a9c-8da3-e294141526eb',
          episodeLength: 1435.122,
        },
      ];

      jest
        .spyOn(skipTimesRepository, 'findSkipTimes')
        .mockReturnValueOnce(Promise.resolve([testSkipTimes[0]]))
        .mockReturnValueOnce(Promise.resolve([testSkipTimes[1]]));

      const skipTimes = await skipTimesService.findSkipTimes(40028, 1, ['op']);

      expect(skipTimes[0]).toEqual(testSkipTimes[0]);
    });

    it('should return only an ending', async () => {
      const testSkipTimes = [
        {
          interval: {
            startTime: 208,
            endTime: 298.556,
          },
          skipType: 'ed' as SkipType,
          skipId: 'c9dfd857-0351-4a90-b37e-582a44253910',
          episodeLength: 1435.122,
        },
        {
          interval: {
            startTime: 173.75,
            endTime: 269.39,
          },
          skipType: 'op' as SkipType,
          skipId: 'd468dafe-3e00-4a9c-8da3-e294141526eb',
          episodeLength: 1435.122,
        },
      ];

      jest
        .spyOn(skipTimesRepository, 'findSkipTimes')
        .mockReturnValueOnce(Promise.resolve([testSkipTimes[0]]))
        .mockReturnValueOnce(Promise.resolve([testSkipTimes[1]]));

      const skipTimes = await skipTimesService.findSkipTimes(40028, 1, ['ed']);

      expect(skipTimes[0]).toEqual(testSkipTimes[0]);
    });

    it('should return an opening and an ending', async () => {
      const testSkipTimes = [
        {
          interval: {
            startTime: 208,
            endTime: 298.556,
          },
          skipType: 'op' as SkipType,
          skipId: 'c9dfd857-0351-4a90-b37e-582a44253910',
          episodeLength: 1435.122,
        },
        {
          interval: {
            startTime: 173.75,
            endTime: 269.39,
          },
          skipType: 'ed' as SkipType,
          skipId: 'd468dafe-3e00-4a9c-8da3-e294141526eb',
          episodeLength: 1435.122,
        },
      ];

      jest
        .spyOn(skipTimesRepository, 'findSkipTimes')
        .mockReturnValueOnce(Promise.resolve([testSkipTimes[0]]))
        .mockReturnValueOnce(Promise.resolve([testSkipTimes[1]]));

      const skipTimes = await skipTimesService.findSkipTimes(40028, 1, [
        'op',
        'ed',
      ]);

      expect(skipTimes[0]).toEqual(testSkipTimes[0]);
    });

    it('should return nothing', async () => {
      jest
        .spyOn(skipTimesRepository, 'findSkipTimes')
        .mockReturnValue(Promise.resolve([]));

      const skipTimes = await skipTimesService.findSkipTimes(40028, 1, [
        'op',
        'ed',
      ]);

      expect(skipTimes).toEqual([]);
    });
  });
});
