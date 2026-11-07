import { afterAll, beforeAll, describe, it } from "bun:test";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { VoteThrottlerGuardTestModule } from "./testing/vote-throttler-guard-test.module";

describe("VoteThrottlerGuard on v1 routes", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [VoteThrottlerGuardTestModule],
    }).compile();

    app = module.createNestApplication();
    app.enableVersioning();
    await app.init();
  });

  describe("GET /v1/test/{skip_id}", () => {
    it("should respond with hello world", (done) => {
      request(app.getHttpServer())
        .post("/v1/test/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")
        .expect("hello world")
        .expect(201, done);
    });

    it("should respond with rate limited", (done) => {
      request(app.getHttpServer())
        .post("/v1/test/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")
        .expect(429, done);
    });

    it("should respond with hello world", (done) => {
      request(app.getHttpServer())
        .post("/v1/test/aaaaaaaa-bbbb-cccc-dddd-ffffffffffff")
        .expect("hello world")
        .expect(201, done);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

describe("VoteThrottlerGuard on v2 routes", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [VoteThrottlerGuardTestModule],
    }).compile();

    app = module.createNestApplication();
    app.enableVersioning();
    await app.init();
  });

  describe("GET /v2/test/{skipId}", () => {
    it("should respond with hello world", (done) => {
      request(app.getHttpServer())
        .post("/v2/test/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")
        .expect("hello world")
        .expect(201, done);
    });

    it("should respond with rate limited", (done) => {
      request(app.getHttpServer())
        .post("/v2/test/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")
        .expect(429, done);
    });

    it("should respond with hello world", (done) => {
      request(app.getHttpServer())
        .post("/v2/test/aaaaaaaa-bbbb-cccc-dddd-ffffffffffff")
        .expect("hello world")
        .expect(201, done);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
