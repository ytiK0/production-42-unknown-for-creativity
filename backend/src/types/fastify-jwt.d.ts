import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { username: string } // то, что вы кладете в token
    user: { username: string }    // то, что появляется после валидации
  }
}
