import { createHash } from "node:crypto";
import type { ExecutionContext } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

/**
 * Rate limits skip time submissions per client and anime episode, so a
 * submission for one episode doesn't count against another.
 */
export class CreateSkipTimeThrottlerGuard extends ThrottlerGuard {
  override generateKey(context: ExecutionContext, suffix: string, name: string): string {
    const { req } = this.getRequestResponse(context);
    // v1 routes use snake_case parameters, v2 camelCase.
    const animeId = req.params.animeId ?? req.params.anime_id;
    const episodeNumber = req.params.episodeNumber ?? req.params.episode_number;
    const prefix = `${context.getClass().name}-${context.getHandler().name}-${animeId}-${episodeNumber}`;

    return createHash("md5").update(`${prefix}-${name}-${suffix}`).digest("hex");
  }
}
