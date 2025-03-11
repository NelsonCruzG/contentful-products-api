import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environmentSchema } from './config/environment.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from './config/database.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { ProductsModule } from './products/products.module';
import { SynchronizationsModule } from './synchronizations/synchronizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: environmentSchema,
    }),
    TypeOrmModule.forRoot(databaseOptions),
    ScheduleModule.forRoot(),
    TasksModule,
    ProductsModule,
    SynchronizationsModule,
  ],
})
export class AppModule {}
