import Fastify, { fastify, FastifyInstance } from 'fastify';
import cors, { fastifyCors } from '@fastify/cors';
import helmet from '@fastify/helmet';
import dbPlugin from './plugins/db';
import jwtPlugin from './plugins/jwt';
import swaggerPlugin from './plugins/swagger';
import websocketPlugin from './plugins/websocket';
import { authRoutes } from './routes/auth.routes';
import { vehicleRoutes } from './routes/vehicle.routes';
import 'reflect-metadata';
import dotenv from 'dotenv';
import fastifyWebsocket from '@fastify/websocket';
import { locationRoutes } from './routes/location.routes';

dotenv.config();
const app: FastifyInstance = Fastify({ logger: true });

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
   'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Upgrade', // WebSocket headers
    'Connection',
    'Sec-WebSocket-Key',
    'Sec-WebSocket-Version',
  ],
  credentials: true,
})

app.register(helmet);
app.register(dbPlugin);
app.register(jwtPlugin);
app.register(swaggerPlugin);
app.register(websocketPlugin);

app.register(authRoutes, { prefix: '/api/auth' });
app.register(vehicleRoutes, { prefix: '/api/vehicles'});

const start = async () => {
  try {
    app.ready(err => {
      if (err) throw err;
      console.log(app.printRoutes());
    });
    
    await app.listen({ port: parseInt(process.env.PORT || '8000') });
    app.log.info(`Server running on http://localhost:${process.env.PORT || 8000}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();