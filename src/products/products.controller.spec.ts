import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { createMockRepository, MockRepository } from '../mocks/repository.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { productQueryMock, productsResponseMock } from './products.mocks';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;
  let repository: MockRepository;
  let productsRepoToken = getRepositoryToken(Product);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: productsRepoToken,
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
    repository = module.get<MockRepository>(productsRepoToken);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return the products', async () => {
      const expected = productsResponseMock;
      jest.spyOn(service, 'findAll').mockImplementation(async () => expected);

      const result = await controller.findAll(productQueryMock);

      expect(result).toBe(expected);
      expect(service.findAll).toHaveBeenCalledWith(productQueryMock);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('Should remove the product', async () => {
      jest.spyOn(service, 'delete').mockImplementation(async () => undefined);
      const result = await controller.remove(1);
      expect(result).toBe(undefined);
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});
