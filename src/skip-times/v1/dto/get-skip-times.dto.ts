import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { malId, uniqueArray } from "../../../common/validation/schemas";
import {
  SKIP_TYPES_V1,
  SkipTimeV1,
  type SkipTimeV2,
  type SkipTypeV1,
} from "../../skip-times.types";

export class GetSkipTimesRequestParamsV1 extends createZodDto(
  z.object({
    anime_id: malId.describe("MAL id of the anime to get"),
    episode_number: z.coerce.number().min(0.5).describe("Episode number to get"),
  }),
) {}

export class GetSkipTimesRequestQueryV1 extends createZodDto(
  z.object({
    types: uniqueArray(z.enum(SKIP_TYPES_V1)).describe("Type of skip time to get"),
  }),
) {}

export class GetSkipTimesResponseV1 extends createZodDto(
  z.object({
    found: z.boolean(),
    results: z.array(SkipTimeV1),
  }),
) {}

/** Converts a skip time to v1's snake_case response format. */
export function toSkipTimeV1(skipTime: SkipTimeV2): SkipTimeV1 {
  return {
    interval: {
      start_time: skipTime.interval.startTime,
      end_time: skipTime.interval.endTime,
    },
    skip_type: skipTime.skipType as SkipTypeV1,
    skip_id: skipTime.skipId,
    episode_length: skipTime.episodeLength,
  };
}
