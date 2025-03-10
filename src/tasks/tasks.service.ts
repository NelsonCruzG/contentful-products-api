import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { ItemWrapper, ResponseWrapper } from 'src/products/products.types';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly endpoint = `${process.env.CONTENTFUL_BASE_URL}/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries`;

  constructor(private readonly httpService: HttpService) {}

  async getPaginatedProducts(): Promise<ItemWrapper[]> {
    this.logger.debug('Starting Fetching products');
    let continueFetching = true;
    const totalItems: ItemWrapper[] = [];
    let limit = 1000;
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

      const observable = this.httpService.get<ResponseWrapper>(
        this.endpoint,
        options,
      );

      try {
        this.logger.debug('Fetching products');
        const response = await firstValueFrom(observable);
        totalItems.push(...response.data.items);
        skip += limit;
        this.logger.debug(`Skipped: ${skip}`);
        this.logger.debug(`Items fetched: ${response.data.items.length}`);

        if (response.data.total <= response.data.skip + response.data.limit) {
          continueFetching = false;
        }
      } catch (error) {
        this.logger.error(`Error fetching products: ${error}`);
        continueFetching = false;
      }
    }

    return totalItems;
  }

  async syncProducts() {
    const response = await this.getPaginatedProducts();
    console.log({ total: response.length });
  }

  // EVERY_30_SECONDS - EVERY_5_SECONDS - EVERY_HOUR
  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: 'hourlySyncTask',
    timeZone: 'America/Los_Angeles',
  })
  async handleCron() {
    this.logger.debug('Starting hourly syncronization task');
    await this.syncProducts();
  }
}
