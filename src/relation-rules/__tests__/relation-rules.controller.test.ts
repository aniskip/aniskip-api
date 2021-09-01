import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RelationRulesService } from '../relation-rules.service';
import { RelationRulesControllerV1 } from '../relation-rules.controller';

describe('RelationRulesController', () => {
  let relationRulesController: RelationRulesControllerV1;

  beforeEach(async () => {
    const mockRelationRulesServiceProvider = {
      provide: RelationRulesService,
      useValue: {},
    };

    const mockThrottlerGuardProvider = {
      provide: ThrottlerGuard,
      useValue: { canActivate: jest.fn(() => true) },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot()],
      controllers: [RelationRulesControllerV1],
      providers: [mockThrottlerGuardProvider, mockRelationRulesServiceProvider],
    }).compile();

    relationRulesController = module.get<RelationRulesControllerV1>(
      RelationRulesControllerV1
    );
  });

  it('should be defined', () => {
    expect(relationRulesController).toBeDefined();
  });
});
