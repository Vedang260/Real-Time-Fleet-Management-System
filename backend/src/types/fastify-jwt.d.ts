import '@fastify/jwt';
import { Role } from '../enums/role.enums';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; username: string; role: Role }; // what you sign
    user: { id: string; username: string; role: Role }; // what you get after verify
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    jwt: {
      sign: (payload: any, options?: any) => string;
      verify: (token: string) => any;
    };
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizeRoles: (...roles: Role[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
