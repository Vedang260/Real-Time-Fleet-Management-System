import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest } from 'fastify';
import jwt from '@fastify/jwt';

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your_jwt_secret'
  });

  fastify.decorate('authenticate', async (request: FastifyRequest) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      throw new Error('Unauthorized');
    }
  });
});