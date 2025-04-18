import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from './config/ormconfig';

const ds = new DataSource(typeOrmConfig);
ds.initialize()
  .then(() => console.log('✅ Successfully connected to DB!'))
  .catch((err) => {
    console.error('❌ Failed to connect to DB!');
    console.error(err);
  });
