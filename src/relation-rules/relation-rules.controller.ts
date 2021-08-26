import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  GetRelationRulesRequestParams,
  GetRelationRulesResponse,
} from './models';
import { RelationRulesService } from './relation-rules.service';

@Controller({
  path: 'relation-rules',
  version: '1',
})
export class RelationRulesControllerV1 {
  constructor(private relationRulesService: RelationRulesService) {}

  @Get('/:anime_id')
  getRules(
    @Param() params: GetRelationRulesRequestParams
  ): GetRelationRulesResponse {
    const episodeRules = this.relationRulesService.getRule(params.anime_id);

    const response = new GetRelationRulesResponse();
    const found = episodeRules.length !== 0;
    response.status_code = found ? HttpStatus.OK : HttpStatus.NOT_FOUND;
    response.message = found
      ? `successfully found rules for anime_id '${params.anime_id}'`
      : `no rules found for anime_id '${params.anime_id}'`;
    response.found = found;
    response.rules = episodeRules;

    if (!found) {
      throw new HttpException(response, response.status_code);
    }

    return response;
  }
}
