import {FastifyInstance, FastifyReply} from "fastify";
import {initORM} from "../../db.js";
import Z from "zod";
import bcrypt from "bcryptjs";
import * as repl from "node:repl";

const authDataSchema = Z.object({
  username: Z.string(),
  password: Z.string()
})

export async function registerUserRoutes (app: FastifyInstance) {
  const db = await initORM();

  function sendSignToken (username: string, reply: FastifyReply, code=200) {
    const token = app.jwt.sign({username}, { expiresIn: 3600 });

    return reply
      .setCookie("jwt", token, {
        maxAge: 3600,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "prod"
      })
      .code(code)
      .send();
  }

  app.post<{
    Body: Z.infer<typeof authDataSchema>
  }>("/register", {
    schema: {
      body: authDataSchema,
    }},
    async (request, reply) => {
    const { username, password } = request.body;

    if (await db.user.isExist(username)) {
      return reply.badRequest("User with provided username already exist");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = db.user.create({username, passwordHash, token: "token!"});

    db.em.persist(newUser);

    await db.em.flush();

    return sendSignToken(username, reply, 201);
  });

  app.post<{
    Body: Z.infer<typeof authDataSchema>
  }>("/login",
    {
      schema: {
        body: authDataSchema
      }
    },
    async (request, reply) => {
    const { username, password } = request.body;

    try {
      if (!(await db.user.isExist(username))) {
        throw new Error("User does not exist")
      }

      const isSuccesses = await db.user.login(username, password);

      if (isSuccesses) {
        return sendSignToken(username, reply);
      } else {
        throw new Error("Incorrect password");
      }
    } catch (error) {
      return reply.badRequest("Login filed");
    }
  })
}