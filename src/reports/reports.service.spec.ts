import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { createMockRepository, MockRepository } from '../mocks/repository.mock';
import { ProductsService } from '../products/products.service';
import { SynchronizationsService } from '../synchronizations/synchronizations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Synchronization } from '../synchronizations/entities/synchronization.entity';
import { Product } from '../products/entities/product.entity';

describe('ReportsService', () => {
  let service: ReportsService;
  let synchronizationRepoToken = getRepositoryToken(Synchronization);
  let productRepoToken = getRepositoryToken(Product);
  let syncronizationsRepo: MockRepository<Synchronization>;
  let productsRepo: MockRepository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ReportsService>(ReportsService);
    syncronizationsRepo = module.get<MockRepository>(synchronizationRepoToken);
    productsRepo = module.get<MockRepository>(productRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleted', () => {
    it('Should return the deleted percentage', async () => {
      productsRepo.count.mockReturnValueOnce(4);
      productsRepo.count.mockReturnValueOnce(100);
      const deleted = await service.deleted();
      expect(deleted).toEqual({
        deleted: 4,
        total: 100,
      });
    });
  });

  describe('nonDeleted', () => {
    it('Should return the non deleted percentage', async () => {
      productsRepo.count.mockReturnValueOnce(4);
      productsRepo.count.mockReturnValueOnce(100);
      const nonDeleted = await service.nonDeleted({});
      expect(nonDeleted).toEqual({
        nonDeleted: 96,
        total: 100,
      });
    });
  });

  describe('synchronizations', () => {
    it('Should return the synchronizations percentage', async () => {
      syncronizationsRepo.count.mockReturnValueOnce(100);
      syncronizationsRepo.count.mockReturnValueOnce(94);
      syncronizationsRepo.count.mockReturnValueOnce(3);
      syncronizationsRepo.count.mockReturnValueOnce(3);
      const synchronizations = await service.synchronizations();
      expect(synchronizations).toEqual({
        success: 94,
        warning: 3,
        error: 3,
        total: 100,
      });
    });
  });
});
