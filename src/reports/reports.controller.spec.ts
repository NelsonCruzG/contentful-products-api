import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Synchronization } from '../synchronizations/entities/synchronization.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { SynchronizationsService } from '../synchronizations/synchronizations.service';
import { createMockRepository } from '../mocks/repository.mock';

describe('ReportsController', () => {
  let controller: ReportsController;
  let synchronizationRepoToken = getRepositoryToken(Synchronization);
  let productRepoToken = getRepositoryToken(Product);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        ReportsService,
        ProductsService,
        SynchronizationsService,
        {
          provide: synchronizationRepoToken,
          useValue: createMockRepository(),
        },
        {
          provide: productRepoToken,
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
