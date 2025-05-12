import {afterAll, assert, beforeAll, beforeEach, expect, test} from "vitest";
import {FastifyInstance, FastifyReply} from "fastify";
import {asyncWrapProviders} from "node:async_hooks";
import {startup} from "../src/app";

let app: FastifyInstance;

beforeAll(async  () => {
  process.env.NODE_ENV = "test";
  app = (await startup(2223)).app;
});

afterAll(async () => {
  await app.close();
});

function verifyJwt(response: any, username: string) {
  // @ts-ignore
  const receiveJwt = response.headers["set-cookie"].split(";")[0].split("=")[1];
  // @ts-ignore
  expect(app.jwt.decode(receiveJwt).username).toBe(username);
}

test("registration test", async () => {
  const username = "ytiK0"

  const response = await app.inject({
    method: "POST",
    path: "/user/register",
    body: {
      username,
      password: "secretpass"
    }
  });

  expect(response.statusCode).toBe(201);
  verifyJwt(response, username);
});

test("login test", async () => {
  const username = "ytiK000";
  const password = "123456789"

  const registerResponse = await app.inject({
    method: "POST",
    path: "/user/register",
    body: {
      username,
      password,
    }
  });

  const correctLogin = await app.inject({
    method: "POST",
    path: "/user/login",
    body: {
      username,
      password
    }
  });

  const badLogin = await app.inject({
    method: "POST",
    path: "/user/login",
    body: {
      username,
      password: "incorrectpas"
    }
  });

  const badLogin2 = await app.inject({
    method: "POST",
    path: "/user/login",
    body: {
      username: "no exist",
      password
    }
  });

  expect(correctLogin.statusCode).toBe(200);
  verifyJwt(correctLogin, username);

  expect(badLogin.statusCode).toBe(app.httpErrors.badRequest().statusCode);
  expect(badLogin2.statusCode).toBe(app.httpErrors.badRequest().statusCode);
});