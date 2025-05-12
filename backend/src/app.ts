import {fastify} from "fastify";
import {initORM} from "./db.js";
import {registerUserRoutes} from "./modules/user/routes.js";
import {serializerCompiler, validatorCompiler, ZodTypeProvider} from "fastify-type-provider-zod";
import {RequestContext} from "@mikro-orm/core";
import sensible from "@fastify/sensible";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyMultipart from "@fastify/multipart";
import {registerOutfitRoutes} from "./modules/outfit/routes.js";
import {configDotenv} from "dotenv";

configDotenv({
  path: ["./.env.local", "./.env"]
});

export async function startup(port: number) {
  const db = await initORM();

  const app = fastify({
    logger: process.env.NODE_ENV !== "prod"
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.addHook("onRequest", (req, rep, done) => {
    RequestContext.create(db.em, done);
  });

  app.register(sensible);

  if (process.env.API_JWT_SECRET === undefined || process.env.API_COOKIE_SECRET === undefined) {
    throw new Error("Secret for encryption jwt not provided");
  }

  app.register(fastifyJwt, {
    secret: process.env.API_JWT_SECRET,
    cookie: {
      cookieName: "jwt",
      signed: process.env.NODE_ENV === "prod"
    }
  });
  app.register(fastifyCookie, {
    secret: process.env.API_COOKIE_SECRET
  });
  app.register(fastifyMultipart, { attachFieldsToBody: false });

  app.register(registerUserRoutes, { prefix: "user" });
  app.register(registerOutfitRoutes, { prefix: "outfit" });

  const url = await app.listen({ port });

  return { app, url };
}