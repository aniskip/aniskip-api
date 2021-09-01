import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RelationRulesService } from '../relation-rules.service';

describe('RelationRulesService', () => {
  let service: RelationRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [] })],
      providers: [RelationRulesService],
    }).compile();

    service = module.get<RelationRulesService>(RelationRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
