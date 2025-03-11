import { Module } from '@nestjs/common';
import { SynchronizationsService } from './synchronizations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Synchronization } from './entities/synchronization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Synchronization])],
  providers: [SynchronizationsService],
  exports: [SynchronizationsService],
})
export class SynchronizationsModule {}
