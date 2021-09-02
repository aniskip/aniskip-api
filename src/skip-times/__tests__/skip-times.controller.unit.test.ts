import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  PostSkipTimesThrottlerGuard,
  PostVoteSkipTimesThrottlerGuard,
} from '../../utils';
import {
  GetSkipTimesRequestParams,
  GetSkipTimesRequestQuery,
  PostCreateSkipTimeRequestBody,
  PostCreateSkipTimeRequestParams,
  PostVoteRequestBody,
  PostVoteRequestParams,
} from '../models';
import { SkipTimesControllerV2 } from '../skip-times.controller';
import { SkipTimesService } from '../skip-times.service';
import { SkipTime } from '../skip-times.types';

describe('SkipTimesController', () => {
  let skipTimesController: SkipTimesControllerV2;
  let skipTimesService: SkipTimesService;

  beforeEach(async () => {
    const mockSkipTimesServiceProvider = {
      provide: SkipTimesService,
      useValue: {
        voteSkipTime: jest.fn(),
        createSkipTime: jest.fn(),
        findSkipTimes: jest.fn(),
      },
    };

    const mockPostVoteSkipTimesThrottlerGuardProvider = {
      provide: PostVoteSkipTimesThrottlerGuard,
      useValue: { canActivate: jest.fn(() => true) },
    };

    const mockThrottlerGuardProvider = {
      provide: ThrottlerGuard,
      useValue: { canActivate: jest.fn(() => true) },
    };

    const mockPostSkipTimesThrottlerGuardProvider = {
      provide: PostSkipTimesThrottlerGuard,
      useValue: { canActivate: jest.fn(() => true) },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot()],
      controllers: [SkipTimesControllerV2],
      providers: [
        mockSkipTimesServiceProvider,
        mockPostVoteSkipTimesThrottlerGuardProvider,
        mockThrottlerGuardProvider,
        mockPostSkipTimesThrottlerGuardProvider,
      ],
    }).compile();

    skipTimesController = module.get<SkipTimesControllerV2>(
      SkipTimesControllerV2
    );
    skipTimesService = module.get<SkipTimesService>(SkipTimesService);
  });

  it('should be defined', () => {
    expect(skipTimesController).toBeDefined();
  });

  describe('voteSkipTime', () => {
    it.each`
      voteType
      ${'upvote'}
      ${'downvote'}
    `('should $voteType a skip time', async ({ voteType }) => {
      jest
        .spyOn(skipTimesService, 'voteSkipTime')
        .mockImplementation(() => Promise.resolve(true));

      const params = new PostVoteRequestParams();
      params.skipId = 'c9dfd857-0351-4a90-b37e-582a44253910';

      const body = new PostVoteRequestBody();
      body.voteType = voteType;

      const response = await skipTimesController.voteSkipTime(params, body);

      expect(response.message).toBeDefined();
      expect(response.statusCode).toBe(HttpStatus.CREATED);
    });

    it.each`
      voteType
      ${'upvote'}
      ${'downvote'}
    `('should throw if $voteType fails', async ({ voteType }) => {
      jest
        .spyOn(skipTimesService, 'voteSkipTime')
        .mockImplementation(() => Promise.resolve(false));

      const params = new PostVoteRequestParams();
      params.skipId = 'c9dfd857-0351-4a90-b37e-582a44253910';

      const body = new PostVoteRequestBody();
      body.voteType = voteType;

      await expect(
        skipTimesController.voteSkipTime(params, body)
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getSkipTimes', () => {
    it('should return skip times', async () => {
      const testSkipTimes: SkipTime[] = [
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
      ];

      jest
        .spyOn(skipTimesService, 'findSkipTimes')
        .mockImplementation(() => Promise.resolve(testSkipTimes));

      const params = new GetSkipTimesRequestParams();
      params.animeId = 40028;
      params.episodeNumber = 1;

      const query = new GetSkipTimesRequestQuery();
      query.types = ['op', 'ed'];

      const response = await skipTimesController.getSkipTimes(params, query);

      expect(response.found).toBeTruthy();
      expect(response.message).toBeDefined();
      expect(response.results).toEqual(testSkipTimes);
      expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it('should throw if no skip times found', async () => {
      jest
        .spyOn(skipTimesService, 'findSkipTimes')
        .mockImplementation(() => Promise.resolve([]));

      const params = new GetSkipTimesRequestParams();
      params.animeId = 40028;
      params.episodeNumber = 1;

      const query = new GetSkipTimesRequestQuery();
      query.types = ['op', 'ed'];

      await expect(
        skipTimesController.getSkipTimes(params, query)
      ).rejects.toThrow(HttpException);
    });
  });

  describe('createSkipTime', () => {
    it('should create a skip time', async () => {
      const testSkipId = '';

      jest
        .spyOn(skipTimesService, 'createSkipTime')
        .mockImplementation(() => Promise.resolve(testSkipId));

      const params = new PostCreateSkipTimeRequestParams();
      params.animeId = 40028;
      params.episodeNumber = 1;

      const body = new PostCreateSkipTimeRequestBody();
      body.startTime = 21.5;
      body.endTime = 112.25;
      body.skipType = 'op';
      body.episodeLength = 1445.17;
      body.submitterId = 'efb943b4-6869-4179-b3a6-81c5d97cf98b';

      const response = await skipTimesController.createSkipTime(params, body);

      expect(response.message).toBeDefined();
      expect(response.skipId).toBe(testSkipId);
      expect(response.statusCode).toBe(HttpStatus.CREATED);
    });

    it('should throw when skip times are invalid', async () => {
      jest.spyOn(skipTimesService, 'createSkipTime').mockImplementation(() => {
        throw new Error();
      });

      const params = new PostCreateSkipTimeRequestParams();
      params.animeId = 40028;
      params.episodeNumber = 1;

      const body = new PostCreateSkipTimeRequestBody();
      body.startTime = 21.5;
      body.endTime = 112.25;
      body.skipType = 'op';
      body.episodeLength = -1;
      body.submitterId = 'efb943b4-6869-4179-b3a6-81c5d97cf98b';

      await expect(
        skipTimesController.createSkipTime(params, body)
      ).rejects.toThrow(HttpException);
    });
  });
});
