import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { ItemWrapper, ResponseWrapper } from 'src/products/products.types';
import { StatusEnum } from 'src/synchronizations/entities/synchronization.entity';
import { SynchronizationsService } from 'src/synchronizations/synchronizations.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly endpoint = `${process.env.CONTENTFUL_BASE_URL}/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries`;

  constructor(
    private readonly httpService: HttpService,
    private readonly synchronizationsService: SynchronizationsService,
  ) {}

  async getPaginatedProducts(lastDate?: Date): Promise<ItemWrapper[]> {
    this.logger.debug('Start Fetching products');
    let continueFetching = true;
    const totalItems: ItemWrapper[] = [];
    let limit = 1_000;
    let skip = 0;

    while (continueFetching) {
      const options = {
        params: {
          content_type: process.env.CONTENTFUL_CONTENT_TYPE,
          access_token: process.env.CONTENTFUL_ACCESS_TOKEN,
          limit,
          skip,
        },
      };

      // If lastDate is set, add it to the params to fetch only updated products
      if (lastDate) {
        options.params['sys.updatedAt[gte]'] = lastDate.toISOString();
      }

      const observable = this.httpService.get<ResponseWrapper>(
        this.endpoint,
        options,
      );

      try {
        this.logger.debug('Fetching products');
        const response = await firstValueFrom(observable);
        totalItems.push(...response.data.items);
        this.logger.debug(`Skipped: ${skip}`);
        this.logger.debug(`Items fetched: ${response.data.items.length}`);

        if (response.data.total <= skip) {
          continueFetching = false;
        }
        skip += limit;
      } catch (error) {
        this.logger.error(`Error fetching products: ${error}`);
      } finally {
        continueFetching = false;
        this.logger.debug('Finished fetching products');
      }
    }

    return totalItems;
  }

  async syncProducts() {
    const startDate = new Date();
    const lastSync = await this.synchronizationsService.findLast();
    const response = await this.getPaginatedProducts(lastSync?.endDate);

    const synchronization = await this.synchronizationsService.create({
      startDate,
      endDate: new Date(),
      updatedRecords: response.length,
      createdRecords: 0,
      removedRecords: 0,
      status: StatusEnum.SUCCESS,
    });

    this.logger.debug('Sync finished');
    this.logger.debug({ synchronization });
  }

  // Testing values: EVERY_30_SECONDS - EVERY_5_SECONDS - EVERY_HOUR
  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'hourlySyncTask',
    timeZone: 'America/Los_Angeles',
  })
  async handleCron() {
    this.logger.debug('Starting hourly syncronization task');
    await this.syncProducts();
  }
}
