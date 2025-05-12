import {FastifyInstance} from "fastify";
import {initORM} from "../../db.js";
import Z from "zod";
import {authPlugin} from "../../plugin/authPlugin.js";

const getLastSchema = Z.object({
  limit: Z.preprocess((arg) => Number(arg), Z.number().min(1))
})

export async function registerOutfitRoutes(app: FastifyInstance) {
  const db = await initORM();

  app.post<{
  }>("/publish",
    {
      preValidation: authPlugin,
    },
    async (request, reply) => {
    return reply.notImplemented();
  });

  app.get<{
    Querystring: Z.infer<typeof getLastSchema>
  }>("/getLast",
    {
      schema: {
        querystring: getLastSchema
      }
    },
    async (request, replay) => {
    const { limit } = request.query;

    const lastOutfits = await db.outfit.find({}, {
      first: limit,
      orderBy: {
        createdAt: "DESC"
      }
    });

    return replay.send(lastOutfits);
  })
}