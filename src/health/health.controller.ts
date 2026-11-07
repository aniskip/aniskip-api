import { Controller, Get, Inject, Logger } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService, HealthIndicatorService } from "@nestjs/terminus";
import type Redis from "ioredis";
import { Pool } from "pg";
import { REDIS } from "./health.constants";

/** How long each dependency may take before it counts as down. */
const CHECK_TIMEOUT_MS = 2000;

/**
 * Reports whether the API can reach Postgres and Redis: 200 when both are up,
 * 503 otherwise. Used by Docker's HEALTHCHECK and CI.
 */
@ApiExcludeController()
@Controller("health")
export class HealthController {
  private logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private indicators: HealthIndicatorService,
    private pool: Pool,
    @Inject(REDIS) private redis: Redis,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.ping("database", () => this.pool.query("SELECT 1")),
      () => this.ping("redis", () => this.redis.ping()),
    ]);
  }

  /**
   * Marks `key` as down if `fn` throws or takes too long. The endpoint is
   * public, so the real error is only logged.
   */
  private ping(key: string, fn: () => Promise<unknown>) {
    return this.indicators
      .check(key)
      .attempt(async () => {
        try {
          await fn();
        } catch (error) {
          this.logger.warn(
            `${key} health check failed: ${error instanceof Error ? error.message : String(error)}`,
          );
          throw new Error("unreachable");
        }
      })
      .withTimeout(CHECK_TIMEOUT_MS);
  }
}
