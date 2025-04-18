import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; username: string; role: string }; // what you sign
    user: { id: string; username: string; role: string }; // what you get after verify
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    jwt: {
      sign: (payload: any, options?: any) => string;
      verify: (token: string) => any;
    };
    authenticate: any;
  }
}
