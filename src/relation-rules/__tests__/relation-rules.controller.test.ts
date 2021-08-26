import { Test, TestingModule } from '@nestjs/testing';
import { RelationRulesController } from '../relation-rules.controller';

describe('RelationRulesController', () => {
  let controller: RelationRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelationRulesController],
    }).compile();

    controller = module.get<RelationRulesController>(RelationRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
