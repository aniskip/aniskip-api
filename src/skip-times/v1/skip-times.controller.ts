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
import {
  days,
  hours,
  minutes,
  Throttle,
  ThrottlerGuard,
} from '@nestjs/throttler';
import { SkipTimesService } from '../skip-times.service';
import { CreateSkipTimeThrottlerGuard } from '../throttling/create-skip-time-throttler.guard';
import { VoteThrottlerGuard } from '../throttling/vote-throttler.guard';
import {
  PostCreateSkipTimeRequestBodyV1,
  PostCreateSkipTimeRequestParamsV1,
  PostCreateSkipTimeResponseV1,
} from './dto/create-skip-time.dto';
import {
  GetSkipTimesRequestParamsV1,
  GetSkipTimesRequestQueryV1,
  GetSkipTimesResponseV1,
  toSkipTimeV1,
} from './dto/get-skip-times.dto';
import {
  PostVoteRequestBodyV1,
  PostVoteRequestParamsV1,
  PostVoteResponseV1,
} from './dto/vote.dto';

@Controller({
  path: 'skip-times',
  version: '1',
})
@ApiTags('skip-times')
export class SkipTimesControllerV1 {
  constructor(private skipTimesService: SkipTimesService) {}

  @UseGuards(VoteThrottlerGuard)
  // Maximum 4 times in 1 hour.
  @Throttle({ default: { limit: 4, ttl: hours(1) } })
  @Post('/vote/:skip_id')
  @ApiOperation({ description: 'Upvotes or downvotes the skip time' })
  @ApiCreatedResponse({
    type: PostVoteResponseV1,
    description: 'Success message',
  })
  async voteSkipTime(
    @Param() params: PostVoteRequestParamsV1,
    @Body() body: PostVoteRequestBodyV1,
  ): Promise<PostVoteResponseV1> {
    const isSuccess = await this.skipTimesService.voteSkipTime(
      body.vote_type,
      params.skip_id,
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
  @Throttle({ default: { limit: 120, ttl: minutes(1) } })
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
    @Query() query: GetSkipTimesRequestQueryV1,
  ): Promise<GetSkipTimesResponseV1> {
    // v1 has no episode length filter; 0 matches any length.
    const skipTimes = await this.skipTimesService.findSkipTimes(
      params.anime_id,
      params.episode_number,
      query.types,
      0,
    );

    const response = new GetSkipTimesResponseV1();
    response.found = skipTimes.length !== 0;
    response.results = skipTimes.map(toSkipTimeV1);

    return response;
  }

  @UseGuards(CreateSkipTimeThrottlerGuard)
  // Maximum 10 times in 1 day.
  @Throttle({ default: { limit: 10, ttl: days(1) } })
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
    @Body() body: PostCreateSkipTimeRequestBodyV1,
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

    let skipId: string;
    try {
      skipId = await this.skipTimesService.createSkipTime(skipTime);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : String(error),
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = new PostCreateSkipTimeResponseV1();
    response.message = 'success';
    response.skip_id = skipId;

    return response;
  }
}
