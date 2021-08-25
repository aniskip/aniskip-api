import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  GetSkipTimesRequestParams,
  GetSkipTimesResponse,
  PostVoteRequestBody,
  PostVoteRequestParams,
  PostVoteResponse,
} from './models';
import { GetSkipTimesRequestQuery } from './models/get-skip-times/get-skip-times-request-query';
import { SkipTimesService } from './skip-times.service';

@Controller({
  path: 'skip-times',
  version: '1',
})
export class SkipTimesControllerV1 {
  constructor(private skipTimesService: SkipTimesService) {}

  @Post('/vote/:skip_id')
  async voteSkipTime(
    @Param() params: PostVoteRequestParams,
    @Body() body: PostVoteRequestBody
  ): Promise<PostVoteResponse> {
    const isSuccess = await this.skipTimesService.voteSkipTime(
      body.vote_type,
      params.skip_id
    );

    if (!isSuccess) {
      const response = new PostVoteResponse();
      response.message = 'Skip time not found';
      response.statusCode = 404;

      throw new HttpException(response, 404);
    }

    const response = new PostVoteResponse();
    response.message = 'successfully upvoted the skip time';
    response.statusCode = 200;

    return response;
  }

  @Get('/:anime_id/:episode_number')
  async getSkipTimes(
    @Param() params: GetSkipTimesRequestParams,
    @Query() query: GetSkipTimesRequestQuery
  ): Promise<GetSkipTimesResponse> {
    const skipTimes = await this.skipTimesService.findSkipTimes(
      params.anime_id,
      params.episode_number,
      query.types
    );

    const response = new GetSkipTimesResponse();
    response.found = skipTimes.length !== 0;
    response.results = skipTimes;
    response.message = response.found
      ? 'successfully found skip times'
      : 'no skip times found';
    response.statusCode = response.found ? 200 : 404;

    if (!response.found) {
      throw new HttpException(response, response.statusCode);
    }

    return response;
  }
}
