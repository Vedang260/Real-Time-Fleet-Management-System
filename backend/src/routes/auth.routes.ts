import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';
import { Role } from '../enums/role.enums';

export async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController(fastify);

  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'email', 'password', 'role'],
        properties: {
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: Object.values(Role) },
        },
      },
    },
  }, authController.register.bind(authController));

  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
    },
  }, authController.login.bind(authController));
}