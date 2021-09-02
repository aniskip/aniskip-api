import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  GetRelationRulesRequestParamsV1,
  GetRelationRulesResponseV1,
} from './models';
import { RelationRulesService } from './relation-rules.service';

@Controller({
  path: 'rules',
  version: '1',
})
@ApiTags('relation-rules')
export class RelationRulesControllerV1 {
  constructor(private relationRulesService: RelationRulesService) {}

  @UseGuards(ThrottlerGuard)
  // Maximum 120 times in 1 minute.
  @Throttle(120, 60)
  @Get('/:anime_id')
  @ApiOperation({
    description: 'Retrieves anime episode number redirection rules',
  })
  @ApiOkResponse({
    type: GetRelationRulesResponseV1,
    description: 'Rules object',
  })
  getRules(
    @Param() params: GetRelationRulesRequestParamsV1
  ): GetRelationRulesResponseV1 {
    const episodeRules = this.relationRulesService.getRule(params.anime_id);

    const response = new GetRelationRulesResponseV1();
    const found = episodeRules.length !== 0;
    response.found = found;
    response.rules = episodeRules;

    return response;
  }
}
