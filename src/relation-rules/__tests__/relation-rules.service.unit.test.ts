import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import path from 'path';
import { RelationsConfig } from '../../config';
import { RelationRulesService } from '../relation-rules.service';

describe('RelationRulesService', () => {
  let relationRulesService: RelationRulesService;

  beforeEach(async () => {
    const mockConfigService = {
      provide: ConfigService,
      useValue: {
        get: jest.fn(
          (): RelationsConfig => ({
            filePath: path.join(__dirname, 'anime-relations.test.txt'),
          })
        ),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [mockConfigService, RelationRulesService],
    }).compile();

    relationRulesService =
      module.get<RelationRulesService>(RelationRulesService);
  });

  it('should be defined', () => {
    expect(relationRulesService).toBeDefined();
  });

  it('should read no rules if file path is not defined', async () => {
    const mockConfigService = {
      provide: ConfigService,
      useValue: {
        get: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [mockConfigService, RelationRulesService],
    }).compile();

    relationRulesService =
      module.get<RelationRulesService>(RelationRulesService);

    expect(relationRulesService.version).toBe('');
  });

  describe('getRule', () => {
    it('should return no rules', () => {
      const rules = relationRulesService.getRule(1);

      expect(rules).toEqual([]);
    });

    it('should return a single episode rule', () => {
      const rules = relationRulesService.getRule(6682);

      expect(rules).toEqual([
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
      ]);
    });

    it('should return a single episode rule with episode 0', () => {
      const rules = relationRulesService.getRule(18153);

      expect(rules).toEqual([
        {
          from: { start: 0, end: 0 },
          to: { malId: 23385, start: 1, end: 1 },
        },
      ]);
    });

    it('should return a range rule', () => {
      const rules = relationRulesService.getRule(31646);

      expect(rules).toEqual([
        {
          from: {
            start: 23,
            end: 44,
          },
          to: {
            malId: 35180,
            start: 1,
            end: 22,
          },
        },
      ]);
    });

    it('should return a self redirecting rule', () => {
      const rules = relationRulesService.getRule(31580);

      expect(rules).toEqual([
        {
          from: {
            start: 14,
            end: 26,
          },
          to: {
            malId: 33253,
            start: 1,
            end: 13,
          },
        },
      ]);
    });

    it('should return a rule with an unknown ending range', () => {
      const rules = relationRulesService.getRule(37178);

      expect(rules).toEqual([
        {
          from: {
            start: 52,
            end: 102,
          },
          to: {
            malId: 38804,
            start: 1,
            end: 51,
          },
        },
        {
          from: {
            start: 103,
          },
          to: {
            malId: 40880,
            start: 1,
          },
        },
      ]);
    });

    it('should return a rule with from mal id is equal to to mal id', () => {
      const rules = relationRulesService.getRule(33820);

      expect(rules).toEqual([
        {
          from: {
            start: 0,
            end: 0,
          },
          to: {
            malId: 33820,
            start: 1,
            end: 1,
          },
        },
      ]);
    });
  });
});
