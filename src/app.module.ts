import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { environmentSchema } from './config/environment.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: environmentSchema,
    }),
    TypeOrmModule.forRoot(databaseOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
