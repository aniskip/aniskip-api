import { Test, TestingModule } from '@nestjs/testing';
import { SkipTypeV1 } from '../skip-times.types';
import { SkipTimesRepository } from '../../repositories';
import { VoteService } from '../../vote';
import { SkipTimesServiceV1 } from '../skip-times.service.v1';

describe('SkipTimesService', () => {
  let skipTimesService: SkipTimesServiceV1;
  let skipTimesRepository: SkipTimesRepository;
  let voteService: VoteService;

  beforeEach(async () => {
    const mockSkipTimesRepositoryProvider = {
      provide: SkipTimesRepository,
      useValue: {
        upvoteSkipTime: jest.fn(),
        downvoteSkipTime: jest.fn(),
        createSkipTime: jest.fn(),
        findSkipTimes: jest.fn(),
        getAverageOfLastTenSkipTimesVotes: jest.fn(),
      },
    };

    const mockVoteServiceProvider = {
      provide: VoteService,
      useValue: { autoVote: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        mockSkipTimesRepositoryProvider,
        mockVoteServiceProvider,
        SkipTimesServiceV1,
      ],
    }).compile();

    skipTimesService = module.get<SkipTimesServiceV1>(SkipTimesServiceV1);
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
        skip_type: 'op' as SkipTypeV1,
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
      const testSkipTimesCamelCase = [
        {
          interval: {
            startTime: 208,
            endTime: 298.556,
          },
          skipType: 'op' as SkipTypeV1,
          skipId: 'c9dfd857-0351-4a90-b37e-582a44253910',
          episodeLength: 1435.122,
        },
        {
          interval: {
            startTime: 173.75,
            endTime: 269.39,
          },
          skipType: 'op' as SkipTypeV1,
          skipId: 'd468dafe-3e00-4a9c-8da3-e294141526eb',
          episodeLength: 1435.122,
        },
      ];

      const testSkipTimesSnakeCase = testSkipTimesCamelCase.map(
        (testSkipTime) => ({
          interval: {
            start_time: testSkipTime.interval.startTime,
            end_time: testSkipTime.interval.endTime,
          },
          skip_type: testSkipTime.skipType,
          skip_id: testSkipTime.skipId,
          episode_length: testSkipTime.episodeLength,
        })
      );

      jest
        .spyOn(skipTimesRepository, 'findSkipTimes')
        .mockReturnValueOnce(Promise.resolve([testSkipTimesCamelCase[0]]))
        .mockReturnValueOnce(Promise.resolve([testSkipTimesCamelCase[1]]));

      const skipTimes = await skipTimesService.findSkipTimes(40028, 1, ['op']);

      expect(skipTimes[0]).toEqual(testSkipTimesSnakeCase[0]);
    });

    it('should return only an ending', async () => {
      const testSkipTimesCamelCase = [
        {
          interval: {
            startTime: 208,
            endTime: 298.556,
          },
          skipType: 'ed' as SkipTypeV1,
          skipId: 'c9dfd857-0351-4a90-b37e-582a44253910',
          episodeLength: 1435.122,
        },
        {
          interval: {
            startTime: 173.75,
            endTime: 269.39,
          },
          skipType: 'op' as SkipTypeV1,
          skipId: 'd468dafe-3e00-4a9c-8da3-e294141526eb',
          episodeLength: 1435.122,
        },
      ];

      const testSkipTimesSnakeCase = testSkipTimesCamelCase.map(
        (testSkipTime) => ({
          interval: {
            start_time: testSkipTime.interval.startTime,
            end_time: testSkipTime.interval.endTime,
          },
          skip_type: testSkipTime.skipType,
          skip_id: testSkipTime.skipId,
          episode_length: testSkipTime.episodeLength,
        })
      );

      jest
        .spyOn(skipTimesRepository, 'findSkipTimes')
        .mockReturnValueOnce(Promise.resolve([testSkipTimesCamelCase[0]]))
        .mockReturnValueOnce(Promise.resolve([testSkipTimesCamelCase[1]]));

      const skipTimes = await skipTimesService.findSkipTimes(40028, 1, ['ed']);

      expect(skipTimes[0]).toEqual(testSkipTimesSnakeCase[0]);
    });

    it('should return an opening and an ending', async () => {
      const testSkipTimesCamelCase = [
        {
          interval: {
            startTime: 208,
            endTime: 298.556,
          },
          skipType: 'op' as SkipTypeV1,
          skipId: 'c9dfd857-0351-4a90-b37e-582a44253910',
          episodeLength: 1435.122,
        },
        {
          interval: {
            startTime: 173.75,
            endTime: 269.39,
          },
          skipType: 'ed' as SkipTypeV1,
          skipId: 'd468dafe-3e00-4a9c-8da3-e294141526eb',
          episodeLength: 1435.122,
        },
      ];

      const testSkipTimesSnakeCase = testSkipTimesCamelCase.map(
        (testSkipTime) => ({
          interval: {
            start_time: testSkipTime.interval.startTime,
            end_time: testSkipTime.interval.endTime,
          },
          skip_type: testSkipTime.skipType,
          skip_id: testSkipTime.skipId,
          episode_length: testSkipTime.episodeLength,
        })
      );

      jest
        .spyOn(skipTimesRepository, 'findSkipTimes')
        .mockReturnValueOnce(Promise.resolve([testSkipTimesCamelCase[0]]))
        .mockReturnValueOnce(Promise.resolve([testSkipTimesCamelCase[1]]));

      const skipTimes = await skipTimesService.findSkipTimes(40028, 1, [
        'op',
        'ed',
      ]);

      expect(skipTimes[0]).toEqual(testSkipTimesSnakeCase[0]);
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
