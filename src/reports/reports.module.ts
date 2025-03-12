import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ProductsModule } from '../products/products.module';
import { SynchronizationsModule } from '../synchronizations/synchronizations.module';
import { ReportsController } from './reports.controller';

@Module({
  imports: [SynchronizationsModule, ProductsModule],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
