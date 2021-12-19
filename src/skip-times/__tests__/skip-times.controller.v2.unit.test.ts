import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  PostSkipTimesV2ThrottlerGuard,
  PostVoteSkipTimesV2ThrottlerGuard,
} from '../../utils';
import {
  GetSkipTimesRequestParamsV2,
  GetSkipTimesRequestQueryV2,
  PostCreateSkipTimeRequestBodyV2,
  PostCreateSkipTimeRequestParamsV2,
  PostVoteRequestBodyV2,
  PostVoteRequestParamsV2,
} from '../models';
import { SkipTimesControllerV2 } from '../skip-times.controller.v2';
import { SkipTimesServiceV2 } from '../skip-times.service.v2';
import { SkipTimeV2, VoteType } from '../skip-times.types';

describe('SkipTimesControllerV2', () => {
  let skipTimesController: SkipTimesControllerV2;
  let skipTimesService: SkipTimesServiceV2;

  beforeEach(async () => {
    const mockSkipTimesServiceProvider = {
      provide: SkipTimesServiceV2,
      useValue: {
        voteSkipTime: jest.fn(),
        createSkipTime: jest.fn(),
        findSkipTimes: jest.fn(),
      },
    };

    const mockPostVoteSkipTimesThrottlerGuardProvider = {
      provide: PostVoteSkipTimesV2ThrottlerGuard,
      useValue: { canActivate: jest.fn(() => true) },
    };

    const mockThrottlerGuardProvider = {
      provide: ThrottlerGuard,
      useValue: { canActivate: jest.fn(() => true) },
    };

    const mockPostSkipTimesThrottlerGuardProvider = {
      provide: PostSkipTimesV2ThrottlerGuard,
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
    skipTimesService = module.get<SkipTimesServiceV2>(SkipTimesServiceV2);
  });

  it('should be defined', () => {
    expect(skipTimesController).toBeDefined();
  });

  describe('voteSkipTime', () => {
    it.each<{ voteType: VoteType }>([
      { voteType: 'upvote' },
      { voteType: 'downvote' },
    ])('should $voteType a skip time', async ({ voteType }) => {
      jest
        .spyOn(skipTimesService, 'voteSkipTime')
        .mockImplementation(() => Promise.resolve(true));

      const params = new PostVoteRequestParamsV2();
      params.skipId = 'c9dfd857-0351-4a90-b37e-582a44253910';

      const body = new PostVoteRequestBodyV2();
      body.voteType = voteType;

      const response = await skipTimesController.voteSkipTime(params, body);

      expect(response.message).toBeDefined();
      expect(response.statusCode).toBe(HttpStatus.CREATED);
    });

    it.each<{ voteType: VoteType }>([
      { voteType: 'upvote' },
      { voteType: 'downvote' },
    ])('should throw if $voteType fails', async ({ voteType }) => {
      jest
        .spyOn(skipTimesService, 'voteSkipTime')
        .mockImplementation(() => Promise.resolve(false));

      const params = new PostVoteRequestParamsV2();
      params.skipId = 'c9dfd857-0351-4a90-b37e-582a44253910';

      const body = new PostVoteRequestBodyV2();
      body.voteType = voteType;

      await expect(
        skipTimesController.voteSkipTime(params, body)
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getSkipTimes', () => {
    it('should return skip times', async () => {
      const testSkipTimes: SkipTimeV2[] = [
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
        {
          interval: {
            startTime: 133.481,
            endTime: 221.531,
          },
          skipType: 'mixed-op',
          skipId: '6b7753de-3636-4cc6-8254-a370c87637e9',
          episodeLength: 1426.9255,
        },
        {
          interval: {
            startTime: 1327.88,
            endTime: 1419.13,
          },
          skipType: 'mixed-ed',
          skipId: 'ae1399ee-998a-4aeb-9789-4f5d62868aff',
          episodeLength: 1427.1191,
        },
        {
          interval: {
            startTime: 130.857,
            endTime: 251.607,
          },
          skipType: 'recap',
          skipId: '14abd949-ad03-4e2a-9a98-4a7dee59f8ab',
          episodeLength: 1430.721,
        },
      ];

      jest
        .spyOn(skipTimesService, 'findSkipTimes')
        .mockImplementation(() => Promise.resolve(testSkipTimes));

      const params = new GetSkipTimesRequestParamsV2();
      params.animeId = 40028;
      params.episodeNumber = 1;

      const query = new GetSkipTimesRequestQueryV2();
      query.types = ['op', 'ed', 'mixed-op', 'mixed-ed', 'recap'];

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

      const params = new GetSkipTimesRequestParamsV2();
      params.animeId = 40028;
      params.episodeNumber = 1;

      const query = new GetSkipTimesRequestQueryV2();
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

      const params = new PostCreateSkipTimeRequestParamsV2();
      params.animeId = 40028;
      params.episodeNumber = 1;

      const body = new PostCreateSkipTimeRequestBodyV2();
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

      const params = new PostCreateSkipTimeRequestParamsV2();
      params.animeId = 40028;
      params.episodeNumber = 1;

      const body = new PostCreateSkipTimeRequestBodyV2();
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
