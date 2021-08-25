import { Test, TestingModule } from '@nestjs/testing';
import { SkipTimesControllerV1 } from '../skip-times.controller';

describe('SkipTimesController', () => {
  let controller: SkipTimesControllerV1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkipTimesControllerV1],
    }).compile();

    controller = module.get<SkipTimesControllerV1>(SkipTimesControllerV1);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
