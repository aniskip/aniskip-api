import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RelationRulesService } from '../relation-rules.service';
import { RelationRulesControllerV2 } from '../relation-rules.controller.v2';
import { GetRelationRulesRequestParams } from '../models';

describe('RelationRulesController', () => {
  let relationRulesController: RelationRulesControllerV2;
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
      controllers: [RelationRulesControllerV2],
      providers: [mockThrottlerGuardProvider, mockRelationRulesServiceProvider],
    }).compile();

    relationRulesController = module.get<RelationRulesControllerV2>(
      RelationRulesControllerV2
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

      const params = new GetRelationRulesRequestParams();
      params.animeId = 1;

      const response = relationRulesController.getRules(params);

      expect(response.found).toBeTruthy();
      expect(response.message).toBeDefined();
      expect(response.rules).toEqual(testRules);
      expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it('should return no rules', () => {
      jest.spyOn(relationRulesService, 'getRule').mockImplementation(() => []);

      const params = new GetRelationRulesRequestParams();
      params.animeId = 1;

      expect(() => relationRulesController.getRules(params)).toThrow(
        HttpException
      );
    });
  });
});
