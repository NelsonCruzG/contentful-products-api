import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ProductsModule } from '../products/products.module';
import { SynchronizationsModule } from '../synchronizations/synchronizations.module';

@Module({
  imports: [SynchronizationsModule, ProductsModule],
  providers: [ReportsService],
})
export class ReportsModule {}
