import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SkipTimeV1 } from '..';
import {
  PostSkipTimesV1ThrottlerGuard,
  PostVoteSkipTimesV1ThrottlerGuard,
} from '../../utils';
import {
  GetSkipTimesRequestParamsV1,
  GetSkipTimesRequestQueryV1,
  PostCreateSkipTimeRequestBodyV1,
  PostCreateSkipTimeRequestParamsV1,
  PostVoteRequestBodyV1,
  PostVoteRequestParamsV1,
} from '../models';
import { SkipTimesControllerV1 } from '../skip-times.controller.v1';
import { SkipTimesServiceV1 } from '../skip-times.service.v1';

describe('SkipTimesControllerV1', () => {
  let skipTimesController: SkipTimesControllerV1;
  let skipTimesService: SkipTimesServiceV1;

  beforeEach(async () => {
    const mockSkipTimesServiceProvider = {
      provide: SkipTimesServiceV1,
      useValue: {
        voteSkipTime: jest.fn(),
        createSkipTime: jest.fn(),
        findSkipTimes: jest.fn(),
      },
    };

    const mockPostVoteSkipTimesThrottlerGuardProvider = {
      provide: PostVoteSkipTimesV1ThrottlerGuard,
      useValue: { canActivate: jest.fn(() => true) },
    };

    const mockThrottlerGuardProvider = {
      provide: ThrottlerGuard,
      useValue: { canActivate: jest.fn(() => true) },
    };

    const mockPostSkipTimesThrottlerGuardProvider = {
      provide: PostSkipTimesV1ThrottlerGuard,
      useValue: { canActivate: jest.fn(() => true) },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot()],
      controllers: [SkipTimesControllerV1],
      providers: [
        mockSkipTimesServiceProvider,
        mockPostVoteSkipTimesThrottlerGuardProvider,
        mockThrottlerGuardProvider,
        mockPostSkipTimesThrottlerGuardProvider,
      ],
    }).compile();

    skipTimesController = module.get<SkipTimesControllerV1>(
      SkipTimesControllerV1
    );
    skipTimesService = module.get<SkipTimesServiceV1>(SkipTimesServiceV1);
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

      const params = new PostVoteRequestParamsV1();
      params.skip_id = 'c9dfd857-0351-4a90-b37e-582a44253910';

      const body = new PostVoteRequestBodyV1();
      body.vote_type = voteType;

      const response = await skipTimesController.voteSkipTime(params, body);

      expect(response.message).toBeDefined();
    });

    it.each`
      voteType
      ${'upvote'}
      ${'downvote'}
    `('should throw if $voteType fails', async ({ voteType }) => {
      jest
        .spyOn(skipTimesService, 'voteSkipTime')
        .mockImplementation(() => Promise.resolve(false));

      const params = new PostVoteRequestParamsV1();
      params.skip_id = 'c9dfd857-0351-4a90-b37e-582a44253910';

      const body = new PostVoteRequestBodyV1();
      body.vote_type = voteType;

      await expect(
        skipTimesController.voteSkipTime(params, body)
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getSkipTimes', () => {
    it('should return skip times', async () => {
      const testSkipTimesV1: SkipTimeV1[] = [
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
      ];

      jest
        .spyOn(skipTimesService, 'findSkipTimes')
        .mockImplementation(() => Promise.resolve(testSkipTimesV1));

      const params = new GetSkipTimesRequestParamsV1();
      params.anime_id = 40028;
      params.episode_number = 1;

      const query = new GetSkipTimesRequestQueryV1();
      query.types = ['op', 'ed'];

      const response = await skipTimesController.getSkipTimes(params, query);

      expect(response.found).toBeTruthy();
      expect(response.results).toEqual(testSkipTimesV1);
    });

    it('should return success if no skip times found', async () => {
      jest
        .spyOn(skipTimesService, 'findSkipTimes')
        .mockImplementation(() => Promise.resolve([]));

      const params = new GetSkipTimesRequestParamsV1();
      params.anime_id = 40028;
      params.episode_number = 1;

      const query = new GetSkipTimesRequestQueryV1();
      query.types = ['op', 'ed'];

      const response = await skipTimesController.getSkipTimes(params, query);

      expect(response.found).toBeFalsy();
      expect(response.results).toEqual([]);
    });
  });

  describe('createSkipTime', () => {
    it('should create a skip time', async () => {
      const testSkipId = '';

      jest
        .spyOn(skipTimesService, 'createSkipTime')
        .mockImplementation(() => Promise.resolve(testSkipId));

      const params = new PostCreateSkipTimeRequestParamsV1();
      params.anime_id = 40028;
      params.episode_number = 1;

      const body = new PostCreateSkipTimeRequestBodyV1();
      body.start_time = 21.5;
      body.end_time = 112.25;
      body.skip_type = 'op';
      body.episode_length = 1445.17;
      body.submitter_id = 'efb943b4-6869-4179-b3a6-81c5d97cf98b';

      const response = await skipTimesController.createSkipTime(params, body);

      expect(response.message).toBeDefined();
      expect(response.skip_id).toBe(testSkipId);
    });

    it('should throw when skip times are invalid', async () => {
      jest.spyOn(skipTimesService, 'createSkipTime').mockImplementation(() => {
        throw new Error();
      });

      const params = new PostCreateSkipTimeRequestParamsV1();
      params.anime_id = 40028;
      params.episode_number = 1;

      const body = new PostCreateSkipTimeRequestBodyV1();
      body.start_time = 21.5;
      body.end_time = 112.25;
      body.skip_type = 'op';
      body.episode_length = -1;
      body.submitter_id = 'efb943b4-6869-4179-b3a6-81c5d97cf98b';

      await expect(
        skipTimesController.createSkipTime(params, body)
      ).rejects.toThrow(HttpException);
    });
  });
});
