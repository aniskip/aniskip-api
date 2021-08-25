import { Test, TestingModule } from '@nestjs/testing';
import { SkipTimesService } from '../skip-times.service';

describe('SkipTimesService', () => {
  let service: SkipTimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkipTimesService],
    }).compile();

    service = module.get<SkipTimesService>(SkipTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
