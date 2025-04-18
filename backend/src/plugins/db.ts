import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { typeOrmConfig } from '../config/ormconfig';
import { DataSource} from 'typeorm';

// Declare Fastify instance decoration types
declare module 'fastify' {
    interface FastifyInstance {
      db: DataSource;
    }
  }

export default fp(async (fastify: FastifyInstance) => {
  try {
    fastify.log.info('Attempting to connect to database with config:', typeOrmConfig);
    const connection = new DataSource(typeOrmConfig);
    await connection.initialize();
    fastify.log.info('Database connected successfully');
    fastify.decorate('db', connection);

  } catch (err: any) {
    fastify.log.error('Database connection error:', err.message);
    throw new Error('Failed to connect to database');
  }
});