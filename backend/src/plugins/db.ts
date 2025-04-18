import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { typeOrmConfig } from '../config/ormconfig';
import { DataSource} from 'typeorm';

export default fp(async (fastify: FastifyInstance) => {
  try {
    const connection = new DataSource(typeOrmConfig);
    fastify.log.info('Database connected successfully');
    fastify.decorate('db', connection);
  } catch (err) {
    fastify.log.error('Database connection error:', err);
    throw new Error('Failed to connect to database');
  }
});