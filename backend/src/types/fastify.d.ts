import { DataSource } from "typeorm";
import '@fastify/jwt';

declare module 'fastify'{
    interface FastifyInstance{
        db: DataSource;
    }
}