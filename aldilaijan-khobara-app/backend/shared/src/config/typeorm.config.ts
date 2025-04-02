import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'aldilaijan_khobara_dev',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../database/migrations/**/*{.ts,.js}'],
  migrationsRun: false,
  synchronize: false, // Set to false in production
  logging: process.env.NODE_ENV === 'development',
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

export default typeOrmConfig;
