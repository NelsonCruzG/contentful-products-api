import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const databaseOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: +process.env.POSTGRES_DB_PORT,
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  autoLoadEntities: true,
  synchronize: true,
  entities: ['./dist/**/**/*.entity.js'],
  migrations: ['./dist/migrations/*.js'],
  logger: 'advanced-console',
  logging: 'all',
  migrationsRun: false,
};
