import { DataSourceOptions } from 'typeorm'; // ← Correct import
import { User } from '../entities/user.entity';
import dotenv from 'dotenv';
import { Vehicle } from '../entities/vehicle.entity';
import { Alert } from '../entities/alert.entity';
import { Location } from '../entities/location.entity';
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
  entities: [User, Vehicle, Location, Alert],
  migrations: [],
  subscribers: [],
};
