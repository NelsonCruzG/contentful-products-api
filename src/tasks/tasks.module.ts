import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { HttpModule } from '@nestjs/axios';
import { SynchronizationsModule } from 'src/synchronizations/synchronizations.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [HttpModule, SynchronizationsModule, ProductsModule],
  providers: [TasksService],
})
export class TasksModule {}
