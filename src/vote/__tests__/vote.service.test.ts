import { Test, TestingModule } from '@nestjs/testing';
import { VoteService } from '../vote.service';

describe('VoteService', () => {
  let service: VoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoteService],
    }).compile();

    service = module.get<VoteService>(VoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
