import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Fleet Management API',
        description: 'API for Real-Time Fleet Management System',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:8000' }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list', // Better for navigation
      deepLinking: true, // Enable deep linking
      filter: true, // Show search/filter box
      persistAuthorization: true, // Remember auth between refreshes
      displayRequestDuration: true, // Show API call duration
      tryItOutEnabled: true // Enable "Try it out" by default
    },
    uiHooks: {
      onRequest: (request, reply, next) => { next() },
      preHandler: (request, reply, next) => { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  });
});