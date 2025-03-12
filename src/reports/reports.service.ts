import { Injectable } from '@nestjs/common';
import { SynchronizationsService } from '../synchronizations/synchronizations.service';
import { ProductsService } from '../products/products.service';
import { ReportsGetQueryDto } from './dto/reports-query.dto';
import { StatusEnum } from '../synchronizations/entities/synchronization.entity';

const fortmatToDecimal = (value: number) => +value.toFixed(2);
@Injectable()
export class ReportsService {
  constructor(
    private readonly syncsService: SynchronizationsService,
    private readonly productsService: ProductsService,
  ) {}

  async deleted() {
    const since = new Date(0);
    const deleted = await this.productsService.removedCount(since);
    const total = await this.productsService.totalCount();
    const percentage = (deleted / total) * 100;
    return {
      deleted: fortmatToDecimal(percentage),
      total: total,
    };
  }
  async nonDeleted(filterDto: ReportsGetQueryDto) {
    const deleted = await this.productsService.totalDeletedCount(filterDto);
    const total = await this.productsService.totalCount();
    const percentage = ((total - deleted) / total) * 100;
    return {
      nonDeleted: fortmatToDecimal(percentage),
      total: total,
    };
  }

  // percentage of successful, warning and failed synchronizations
  async synchronizations() {
    const total = await this.syncsService.totalCount();
    const success = await this.syncsService.totalCount(StatusEnum.SUCCESS);
    const warning = await this.syncsService.totalCount(StatusEnum.WARNING);
    const error = await this.syncsService.totalCount(StatusEnum.ERROR);

    const successPercentage = (success / total) * 100;
    const warningPercentage = (warning / total) * 100;
    const errorPercentage = (error / total) * 100;

    return {
      success: fortmatToDecimal(successPercentage),
      warning: fortmatToDecimal(warningPercentage),
      error: fortmatToDecimal(errorPercentage),
      total: fortmatToDecimal(total),
    };
  }
}
