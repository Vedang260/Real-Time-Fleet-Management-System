import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { Role } from '../enums/role.enums';
dotenv.config();

declare module 'fastify' {
  interface FastifyInstance {
    // jwt: {
    //   sign: (payload: any, options?: any) => string;
    //   verify: (token: string) => any;
    // };
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizeRoles: (...roles: Role[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
};

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your_jwt_secret'
  });

  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ message: 'Unauthorized' });
      }
    }
  );

  fastify.decorate(
    'authorizeRoles',
    function (...allowedRoles: string[]) {
      return async function (request: FastifyRequest, reply: FastifyReply) {
        const user = request.user as any;
        if (!allowedRoles.includes(user?.role)) {
          return reply.code(403).send({ message: 'Forbidden: Insufficient role' });
        }
      };
    }
  );
});