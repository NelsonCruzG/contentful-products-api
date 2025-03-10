import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { HttpModule } from '@nestjs/axios';
import { SynchronizationsModule } from 'src/synchronizations/synchronizations.module';

@Module({
  imports: [HttpModule, SynchronizationsModule],
  providers: [TasksService],
})
export class TasksModule {}
