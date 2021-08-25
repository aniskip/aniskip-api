import { Body, Controller, HttpException, Param, Post } from '@nestjs/common';
import { VoteRequestBody, VoteRequestParams, VoteResponse } from './models';
import { SkipTimesService } from './skip-times.service';

@Controller({
  path: 'skip-times',
  version: '1',
})
export class SkipTimesControllerV1 {
  constructor(private skipTimesService: SkipTimesService) {}

  @Post('/vote/:skip_id')
  async voteSkipTime(
    @Param() params: VoteRequestParams,
    @Body() body: VoteRequestBody
  ): Promise<VoteResponse> {
    const isSuccess = await this.skipTimesService.voteSkipTime(
      body.vote_type,
      params.skip_id
    );

    if (!isSuccess) {
      const voteResponse = new VoteResponse();
      voteResponse.message = 'Skip time not found';

      throw new HttpException(voteResponse, 404);
    }

    const voteResponse = new VoteResponse();
    voteResponse.message = 'Successfully upvoted the skip time';

    return voteResponse;
  }
}
