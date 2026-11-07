import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { id, malId, seconds } from "../../../common/validation/schemas";
import { SKIP_TYPES_V2 } from "../../skip-times.types";

export class PostCreateSkipTimeRequestParamsV2 extends createZodDto(
  z.object({
    animeId: malId.describe("MAL id of the anime to create a new skip time for"),
    episodeNumber: z.coerce
      .number()
      .min(0)
      .describe("Episode number of the anime to create a new skip time for"),
  }),
) {}

export class PostCreateSkipTimeRequestBodyV2 extends createZodDto(
  z
    .object({
      skipType: z.enum(SKIP_TYPES_V2),
      providerName: z.string().max(64),
      startTime: seconds,
      endTime: seconds,
      episodeLength: seconds,
      submitterId: id,
    })
    .refine((body) => body.endTime > body.startTime, {
      message: "must be after startTime",
      path: ["endTime"],
    })
    .refine((body) => body.endTime <= body.episodeLength, {
      message: "must not be after episodeLength",
      path: ["endTime"],
    }),
) {}

export class PostCreateSkipTimeResponseV2 extends createZodDto(
  z.object({
    statusCode: z.number(),
    message: z.string(),
    skipId: id,
  }),
) {}
