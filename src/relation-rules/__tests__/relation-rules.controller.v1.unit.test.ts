import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RelationRulesService } from '../relation-rules.service';
import { RelationRulesControllerV1 } from '../relation-rules.controller.v1';
import { GetRelationRulesRequestParamsV1 } from '../models';

describe('RelationRulesControllerV1', () => {
  let relationRulesController: RelationRulesControllerV1;
  let relationRulesService: RelationRulesService;

  beforeEach(async () => {
    const mockRelationRulesServiceProvider = {
      provide: RelationRulesService,
      useValue: { getRule: jest.fn() },
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
    relationRulesService =
      module.get<RelationRulesService>(RelationRulesService);
  });

  it('should be defined', () => {
    expect(relationRulesController).toBeDefined();
  });

  describe('getRules', () => {
    it('should return rules', () => {
      const testRules = [
        {
          from: {
            start: 13,
            end: 13,
          },
          to: {
            malId: 7739,
            start: 1,
            end: 1,
          },
        },
      ];

      jest
        .spyOn(relationRulesService, 'getRule')
        .mockImplementation(() => testRules);

      const params = new GetRelationRulesRequestParamsV1();
      params.anime_id = 1;

      const response = relationRulesController.getRules(params);

      expect(response.found).toBeTruthy();
      expect(response.rules).toEqual(testRules);
    });

    it('should return no rules', () => {
      jest.spyOn(relationRulesService, 'getRule').mockImplementation(() => []);

      const params = new GetRelationRulesRequestParamsV1();
      params.anime_id = 1;

      const response = relationRulesController.getRules(params);

      expect(response.found).toBeFalsy();
      expect(response.rules).toEqual([]);
    });
  });
});
