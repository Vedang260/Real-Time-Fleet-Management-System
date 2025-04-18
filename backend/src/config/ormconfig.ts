import { DataSourceOptions } from 'typeorm'; // ← Correct import
// import { User } from '../entities/User';
// import { Vehicle } from '../entities/Vehicle';
// import { Role } from '../entities/Role';
// import { LocationHistory } from '../entities/LocationHistory';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'fleet_management',
  synchronize: true, // ❗ Set to false in production and use migrations instead
  logging: true,
//  entities: [User, Role, Vehicle, LocationHistory],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
};
