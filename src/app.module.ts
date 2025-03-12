import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environmentSchema } from './config/environment.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from './config/database.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { ProductsModule } from './products/products.module';
import { SynchronizationsModule } from './synchronizations/synchronizations.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { ReportsModule } from './reports/reports.module';

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
    AuthModule,
    UsersModule,
    ReportsModule,
  ],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
