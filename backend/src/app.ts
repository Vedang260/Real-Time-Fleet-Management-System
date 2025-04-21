import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import dbPlugin from './plugins/db';
import jwtPlugin from './plugins/jwt';
import swaggerPlugin from './plugins/swagger';
import websocketPlugin from './plugins/websocket';
import { authRoutes } from './routes/auth.routes';
import { vehicleRoutes } from './routes/vehicle.routes';
import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();
const app: FastifyInstance = Fastify({ logger: true });


app.register(cors, { origin: '*' });
app.register(helmet);
app.register(dbPlugin);
app.register(jwtPlugin);
app.register(swaggerPlugin);
app.register(websocketPlugin);

app.register(authRoutes, { prefix: '/api/auth' });
app.register(vehicleRoutes, { prefix: '/api/vehicles'});
const start = async () => {
  try {
    await app.listen({ port: parseInt(process.env.PORT || '8000') });
    app.log.info(`Server running on http://localhost:${process.env.PORT || 8000}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();