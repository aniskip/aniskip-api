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
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { days, hours, minutes, Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { SkipTimesService } from "../skip-times.service";
import { CreateSkipTimeThrottlerGuard } from "../throttling/create-skip-time-throttler.guard";
import { VoteThrottlerGuard } from "../throttling/vote-throttler.guard";
import {
  PostCreateSkipTimeRequestBodyV2,
  PostCreateSkipTimeRequestParamsV2,
  PostCreateSkipTimeResponseV2,
} from "./dto/create-skip-time.dto";
import {
  GetSkipTimesRequestParamsV2,
  GetSkipTimesRequestQueryV2,
  GetSkipTimesResponseV2,
} from "./dto/get-skip-times.dto";
import { PostVoteRequestBodyV2, PostVoteRequestParamsV2, PostVoteResponseV2 } from "./dto/vote.dto";

@Controller({
  path: "skip-times",
  version: "2",
})
@ApiTags("skip-times")
export class SkipTimesControllerV2 {
  constructor(private skipTimesService: SkipTimesService) {}

  @UseGuards(VoteThrottlerGuard)
  // Maximum 4 times in 1 hour.
  @Throttle({ default: { limit: 4, ttl: hours(1) } })
  @Post("/vote/:skipId")
  @ApiOperation({ description: "Upvotes or downvotes the skip time" })
  @ApiCreatedResponse({
    type: PostVoteResponseV2,
    description: "Success message",
  })
  async voteSkipTime(
    @Param() params: PostVoteRequestParamsV2,
    @Body() body: PostVoteRequestBodyV2,
  ): Promise<PostVoteResponseV2> {
    const isSuccess = await this.skipTimesService.voteSkipTime(body.voteType, params.skipId);

    if (!isSuccess) {
      const response = new PostVoteResponseV2();
      response.message = "Skip time not found";
      response.statusCode = HttpStatus.NOT_FOUND;

      throw new HttpException(response, response.statusCode);
    }

    const response = new PostVoteResponseV2();
    response.message = `Successfully ${body.voteType} the skip time`;
    response.statusCode = HttpStatus.CREATED;

    return response;
  }

  @UseGuards(ThrottlerGuard)
  // Maximum 120 times in 1 minute.
  @Throttle({ default: { limit: 120, ttl: minutes(1) } })
  @Get("/:animeId/:episodeNumber")
  @ApiOperation({
    description: "Retrieves the opening or ending skip times for a specific anime episode",
  })
  @ApiOkResponse({
    type: GetSkipTimesResponseV2,
    description: "Skip times object(s)",
  })
  async getSkipTimes(
    @Param() params: GetSkipTimesRequestParamsV2,
    @Query() query: GetSkipTimesRequestQueryV2,
  ): Promise<GetSkipTimesResponseV2> {
    const skipTimes = await this.skipTimesService.findSkipTimes(
      params.animeId,
      params.episodeNumber,
      query.types,
      query.episodeLength,
    );

    const response = new GetSkipTimesResponseV2();
    response.found = skipTimes.length !== 0;
    response.results = skipTimes;
    response.message = response.found ? "Successfully found skip times" : "No skip times found";
    response.statusCode = response.found ? HttpStatus.OK : HttpStatus.NOT_FOUND;

    if (!response.found) {
      throw new HttpException(response, response.statusCode);
    }

    return response;
  }

  @UseGuards(CreateSkipTimeThrottlerGuard)
  // Maximum 10 times in 1 day.
  @Throttle({ default: { limit: 10, ttl: days(1) } })
  @Post("/:animeId/:episodeNumber")
  @ApiOperation({
    description: "Creates the opening or ending skip times for a specific anime episode",
  })
  @ApiOkResponse({
    type: PostCreateSkipTimeResponseV2,
    description: "An object containing the skip time parameters",
  })
  async createSkipTime(
    @Param() params: PostCreateSkipTimeRequestParamsV2,
    @Body() body: PostCreateSkipTimeRequestBodyV2,
  ): Promise<PostCreateSkipTimeResponseV2> {
    const skipTime = {
      anime_id: params.animeId,
      end_time: body.endTime,
      episode_length: body.episodeLength,
      episode_number: params.episodeNumber,
      provider_name: body.providerName,
      skip_type: body.skipType,
      start_time: body.startTime,
      submitter_id: body.submitterId,
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

    const response = new PostCreateSkipTimeResponseV2();
    response.message = "Successfully created a skip time";
    response.skipId = skipId;
    response.statusCode = HttpStatus.CREATED;

    return response;
  }
}
