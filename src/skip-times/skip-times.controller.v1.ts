import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  PostSkipTimesV1ThrottlerGuard,
  PostVoteSkipTimesV1ThrottlerGuard,
} from '../utils';
import {
  GetSkipTimesRequestParamsV1,
  GetSkipTimesRequestQueryV1,
  GetSkipTimesResponseV1,
  PostCreateSkipTimeRequestBodyV1,
  PostCreateSkipTimeRequestParamsV1,
  PostCreateSkipTimeResponseV1,
  PostVoteRequestBodyV1,
  PostVoteRequestParamsV1,
  PostVoteResponseV1,
} from './models';
import { SkipTimesService } from './skip-times.service';

@Controller({
  path: 'skip-times',
  version: '1',
})
@ApiTags('skip-times')
export class SkipTimesControllerV1 {
  constructor(private skipTimesService: SkipTimesService) {}

  @UseGuards(PostVoteSkipTimesV1ThrottlerGuard)
  // Maximum 4 times in 1 hour.
  @Throttle(4, 60 * 60)
  @Post('/vote/:skip_id')
  @ApiOperation({ description: 'Upvotes or downvotes the skip time' })
  @ApiCreatedResponse({
    type: PostVoteResponseV1,
    description: 'Success message',
  })
  async voteSkipTime(
    @Param() params: PostVoteRequestParamsV1,
    @Body() body: PostVoteRequestBodyV1
  ): Promise<PostVoteResponseV1> {
    const isSuccess = await this.skipTimesService.voteSkipTime(
      body.vote_type,
      params.skip_id
    );

    if (!isSuccess) {
      const response = new PostVoteResponseV1();
      response.message = 'Skip time not found';

      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }

    const response = new PostVoteResponseV1();
    response.message = 'success';

    return response;
  }

  @UseGuards(ThrottlerGuard)
  // Maximum 120 times in 1 minute.
  @Throttle(120, 60)
  @Get('/:anime_id/:episode_number')
  @ApiOperation({
    description:
      'Retrieves the opening or ending skip times for a specific anime episode',
  })
  @ApiOkResponse({
    type: GetSkipTimesResponseV1,
    description: 'Skip times object(s)',
  })
  async getSkipTimes(
    @Param() params: GetSkipTimesRequestParamsV1,
    @Query() query: GetSkipTimesRequestQueryV1
  ): Promise<GetSkipTimesResponseV1> {
    const skipTimes = await this.skipTimesService.findSkipTimes(
      params.anime_id,
      params.episode_number,
      query.types
    );

    const response = new GetSkipTimesResponseV1();
    response.found = skipTimes.length !== 0;
    response.results = skipTimes.map((skipTime) => ({
      interval: {
        start_time: skipTime.interval.startTime,
        end_time: skipTime.interval.endTime,
      },
      episode_length: skipTime.episodeLength,
      skip_id: skipTime.skipId,
      skip_type: skipTime.skipType,
    }));

    return response;
  }

  @UseGuards(PostSkipTimesV1ThrottlerGuard)
  // Maximum 10 times in 1 day.
  @Throttle(10, 60 * 60 * 24)
  @Post('/:anime_id/:episode_number')
  @ApiOperation({
    description:
      'Creates the opening or ending skip times for a specific anime episode',
  })
  @ApiOkResponse({
    type: PostCreateSkipTimeResponseV1,
    description: 'An object containing the skip time parameters',
  })
  async createSkipTime(
    @Param() params: PostCreateSkipTimeRequestParamsV1,
    @Body() body: PostCreateSkipTimeRequestBodyV1
  ): Promise<PostCreateSkipTimeResponseV1> {
    const skipTime = {
      anime_id: params.anime_id,
      end_time: body.end_time,
      episode_length: body.episode_length,
      episode_number: params.episode_number,
      provider_name: body.provider_name,
      skip_type: body.skip_type,
      start_time: body.start_time,
      submitter_id: body.submitter_id,
    };

    let skipId;
    try {
      skipId = await this.skipTimesService.createSkipTime(skipTime);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    const response = new PostCreateSkipTimeResponseV1();
    response.message = 'success';
    response.skip_id = skipId;

    return response;
  }
}
