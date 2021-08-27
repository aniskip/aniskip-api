import { Test, TestingModule } from '@nestjs/testing';
import { RelationRulesControllerV1 } from '../relation-rules.controller';

describe('RelationRulesController', () => {
  let controller: RelationRulesControllerV1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelationRulesControllerV1],
    }).compile();

    controller = module.get<RelationRulesControllerV1>(
      RelationRulesControllerV1
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
