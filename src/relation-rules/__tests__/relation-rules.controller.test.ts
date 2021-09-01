import { Test, TestingModule } from '@nestjs/testing';
import { getOptionsToken } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerStorageProvider } from '@nestjs/throttler/dist/throttler.providers';
import { RelationRulesService } from '../relation-rules.service';
import { RelationRulesControllerV1 } from '../relation-rules.controller';

describe('RelationRulesController', () => {
  let relationRulesController: RelationRulesControllerV1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [] })],
      controllers: [RelationRulesControllerV1],
      providers: [
        {
          provide: getOptionsToken(),
          useValue: {},
        },
        ThrottlerStorageProvider,
        RelationRulesService,
      ],
    }).compile();

    relationRulesController = module.get<RelationRulesControllerV1>(
      RelationRulesControllerV1
    );
  });

  it('should be defined', () => {
    expect(relationRulesController).toBeDefined();
  });
});
