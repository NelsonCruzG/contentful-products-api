import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { createMockRepository, MockRepository } from '../mocks/repository.mock';
import {
  convertedProductMock,
  itemWrapperMock,
  productMock,
} from './products.mocks';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<MockRepository>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertToProduct', () => {
    it('should convert item to product', () => {
      const product = service.convertToProduct(itemWrapperMock);
      expect(product).toEqual(convertedProductMock);
    });
  });

  describe('create', () => {
    it('Should create and return the product', async () => {
      repository.save.mockReturnValue(productMock);
      const product = await service.create(convertedProductMock);
      expect(product).toEqual(productMock);
    });
  });

  describe('createMany', () => {
    it('Should create and return the products', async () => {
      repository.save.mockReturnValue([productMock]);
      const products = await service.createMany([convertedProductMock]);
      expect(products).toEqual([productMock]);
    });
  });

  describe('findByExternalId', () => {
    it('Should return the product', async () => {
      repository.findOneBy.mockReturnValue(productMock);
      const product = await service.findByExternalId(productMock.externalId);
      expect(product).toEqual(productMock);
    });
  });

  describe('update', () => {
    it('Should update and return the product', async () => {
      repository.preload.mockReturnValue(productMock);
      repository.save.mockReturnValue(productMock);
      const product = await service.update(
        productMock.productId,
        convertedProductMock,
      );
      expect(product).toEqual(productMock);
    });
  });

  describe('removedCount', () => {
    it('Should return the number of removed products', async () => {
      repository.count.mockReturnValue(1);
      const count = await service.removedCount();
      expect(count).toEqual(1);
    });
  });
});
