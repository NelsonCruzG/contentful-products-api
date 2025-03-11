import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { SynchronizationsService } from '../synchronizations/synchronizations.service';
import { ProductsService } from '../products/products.service';
import {
  createMockHttpService,
  createMockRepository,
  MockHttpService,
  MockRepository,
} from '../mocks/repository.mock';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  StatusEnum,
  Synchronization,
} from '../synchronizations/entities/synchronization.entity';
import { Product } from '../products/entities/product.entity';
import { of, throwError } from 'rxjs';
import { httpResponseMock } from './tasks.mocks';
import { itemWrapperMock, productMock } from '../products/products.mocks';
import { synchronizationMock } from '../synchronizations/synchronizations.mocks';

describe('TasksService', () => {
  let service: TasksService;
  let httpService: MockHttpService;
  let synchronizationRepoToken = getRepositoryToken(Synchronization);
  let productRepoToken = getRepositoryToken(Product);
  let syncronizationsRepo: MockRepository<Synchronization>;
  let productsRepo: MockRepository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        SynchronizationsService,
        ProductsService,
        {
          provide: HttpService,
          useValue: createMockHttpService(),
        },
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

    service = module.get<TasksService>(TasksService);
    httpService = module.get<MockHttpService>(HttpService);
    syncronizationsRepo = module.get<MockRepository>(synchronizationRepoToken);
    productsRepo = module.get<MockRepository>(productRepoToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPaginatedProducts', () => {
    describe('When fetching products using pagination works', () => {
      it('Should return all products after fetching using pagination', async () => {
        httpService.get.mockReturnValue(of(httpResponseMock));
        const products = await service.getPaginatedProducts();
        expect(products).toEqual([itemWrapperMock]);
      });

      it('Should return all products after fetching using pagination with lastDate', async () => {
        const lastDate = new Date();
        httpService.get.mockReturnValue(of(httpResponseMock));
        const products = await service.getPaginatedProducts(lastDate);
        expect(products).toEqual([itemWrapperMock]);
      });
    });

    describe('When fetching products using pagination fails', () => {
      it('Should handle error', async () => {
        const customError = new Error('Some http error');
        httpService.get.mockReturnValue(throwError(() => customError));

        try {
          await service.getPaginatedProducts();
        } catch (error) {
          expect(error).toEqual(customError);
          expect(httpService.get).toHaveBeenCalledTimes(1);
        }
      });
    });

    describe('Otherwise', () => {
      it('Should return an empty array', async () => {
        httpService.get.mockReturnValue(of({ data: { items: [] } }));
        const products = await service.getPaginatedProducts();
        expect(products).toEqual([]);
      });
    });
  });

  describe('matchProducts', () => {
    describe('When mathching a list of existing products', () => {
      it('Should return the number of existing products in the list', async () => {
        productsRepo.findOneBy.mockReturnValueOnce(productMock);
        const result = await service.matchProducts([itemWrapperMock]);
        expect(result.existingProducts).toEqual(1);
      });
    });

    describe('When mathching a list of new products', () => {
      it('Should return the number of new products in the list', async () => {
        productsRepo.findOneBy.mockReturnValueOnce(null);
        const result = await service.matchProducts([itemWrapperMock]);
        expect(result.newProducts).toEqual(1);
      });
    });

    describe('Unless product is not visible', () => {
      it('Should return 0', async () => {
        const productRemovedMock = { ...productMock, isVisible: false };
        productsRepo.findOneBy.mockReturnValueOnce(productRemovedMock);
        const result = await service.matchProducts([itemWrapperMock]);
        expect(result.existingProducts).toEqual(0);
        expect(result.newProducts).toEqual(0);
      });
    });
  });

  describe('syncronizeProducts', () => {
    describe('When syncronizing products works', () => {
      it('Should update/create products and insert synchronization', async () => {
        syncronizationsRepo.findOne.mockReturnValue(synchronizationMock);
        httpService.get.mockReturnValueOnce(of(httpResponseMock));
        productsRepo.findOneBy.mockReturnValueOnce(productMock);
        productsRepo.count.mockReturnValue(0);

        const synchronizationMock2 = {
          ...synchronizationMock,
          lastSync: new Date(),
        };
        syncronizationsRepo.save.mockReturnValueOnce(synchronizationMock2);

        const result = await service.syncronizeProducts();

        expect(result).toEqual(synchronizationMock2);
        expect(httpService.get).toHaveBeenCalledTimes(1);
        expect(syncronizationsRepo.save).toHaveBeenCalledTimes(1);
        expect(productsRepo.save).toHaveBeenCalledTimes(1);
      });
    });

    describe('When syncronizing products fails', () => {
      describe('When error is http', () => {
        it('Should save synchronization with error status and message', async () => {
          const customError = new Error('Some http error');
          httpService.get.mockReturnValueOnce(throwError(() => customError));

          const synchronizationErrorMock = {
            ...synchronizationMock,
            lastSync: new Date(),
            status: StatusEnum.ERROR,
            errorMessage: customError.message,
          };
          syncronizationsRepo.save.mockReturnValueOnce(
            synchronizationErrorMock,
          );
          const result = await service.syncronizeProducts();
          expect(result).toEqual(synchronizationErrorMock);

          expect(httpService.get).toHaveBeenCalledTimes(1);
          expect(syncronizationsRepo.save).toHaveBeenCalledTimes(1);
          expect(productsRepo.findOneBy).toHaveBeenCalledTimes(0);
          expect(productsRepo.save).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('When error is critical', () => {
      it('Should be catched and no synchronization is saved', async () => {
        syncronizationsRepo.findOne.mockReturnValue(synchronizationMock);
        httpService.get.mockReturnValueOnce(of(httpResponseMock));
        const customError = new Error('Some database error');
        productsRepo.findOneBy.mockRejectedValueOnce(customError);

        try {
          await service.syncronizeProducts();
        } catch (error) {
          expect(error).toEqual(customError);
          expect(httpService.get).toHaveBeenCalledTimes(1);
          expect(syncronizationsRepo.save).toHaveBeenCalledTimes(0);
          expect(productsRepo.findOneBy).toHaveBeenCalledTimes(0);
          expect(productsRepo.save).toHaveBeenCalledTimes(0);
        }
      });
    });
  });

  describe('handleCron', () => {
    it('Should call syncronizeProducts', async () => {
      jest
        .spyOn(service, 'syncronizeProducts')
        .mockImplementation(() => undefined);

      const customError = new Error('Some http error');
      httpService.get.mockReturnValueOnce(throwError(() => customError));

      await service.handleCron();
      expect(service.syncronizeProducts).toHaveBeenCalledTimes(1);
    });
  });
});
