import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  PostSkipTimesThrottlerGuard,
  PostVoteSkipTimesThrottlerGuard,
} from '../../utils';
import { SkipTimesControllerV1 } from '../skip-times.controller';
import { SkipTimesService } from '../skip-times.service';

describe('SkipTimesController', () => {
  let skipTimesController: SkipTimesControllerV1;

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
  });

  it('should be defined', () => {
    expect(skipTimesController).toBeDefined();
  });
});
