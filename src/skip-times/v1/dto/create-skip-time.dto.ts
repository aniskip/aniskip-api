import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { id, malId, seconds } from "../../../common/validation/schemas";
import { SKIP_TYPES_V1 } from "../../skip-times.types";

export class PostCreateSkipTimeRequestParamsV1 extends createZodDto(
  z.object({
    anime_id: malId.describe("MAL id of the anime to create a new skip time for"),
    episode_number: z.coerce
      .number()
      .min(0.5)
      .describe("Episode number of the anime to create a new skip time for"),
  }),
) {}

export class PostCreateSkipTimeRequestBodyV1 extends createZodDto(
  z
    .object({
      skip_type: z.enum(SKIP_TYPES_V1),
      provider_name: z.string().max(64),
      start_time: seconds,
      end_time: seconds,
      episode_length: seconds,
      submitter_id: id,
    })
    .refine((body) => body.end_time > body.start_time, {
      message: "must be after start_time",
      path: ["end_time"],
    })
    .refine((body) => body.end_time <= body.episode_length, {
      message: "must not be after episode_length",
      path: ["end_time"],
    }),
) {}

export class PostCreateSkipTimeResponseV1 extends createZodDto(
  z.object({
    message: z.string(),
    skip_id: id,
  }),
) {}
