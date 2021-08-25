import { Test, TestingModule } from '@nestjs/testing';
import { PostgresService } from '../postgres.service';

describe('PostgresService', () => {
  let service: PostgresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostgresService],
    }).compile();

    service = module.get<PostgresService>(PostgresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
