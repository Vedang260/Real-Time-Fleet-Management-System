import { DataSourceOptions } from 'typeorm'; // ← Correct import
import { User } from '../entities/user.entity';
import dotenv from 'dotenv';
dotenv.config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'fleet_management',
  synchronize: true, // ❗ Set to false in production and use migrations instead
  logging: ['error', 'query', 'schema'],
  entities: [User],
  migrations: [],
  subscribers: [],
};
