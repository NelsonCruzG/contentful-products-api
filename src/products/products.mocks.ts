import { Product } from './entities/product.entity';
import { ConvertedProduct, ItemWrapper, ProductFields } from './products.types';

const baseDateMock = new Date('2025-01-01');
const metadataMock = { tags: [], concepts: [] };
const sysMock: any = {
  id: 'externalId_1',
  createdAt: baseDateMock,
  updatedAt: baseDateMock,
};

const fieldsMock: ProductFields = {
  sku: 'sku',
  name: 'name',
  brand: 'brand',
  model: 'model',
  category: 'category',
  color: 'color',
  price: 0,
  currency: 'currency',
  stock: 0,
};

export const itemWrapperMock: ItemWrapper = {
  metadata: metadataMock,
  sys: sysMock,
  fields: fieldsMock,
};

export const convertedProductMock: ConvertedProduct = {
  sku: 'sku',
  name: 'name',
  brand: 'brand',
  model: 'model',
  category: 'category',
  color: 'color',
  price: 0,
  currency: 'currency',
  stock: 0,
  externalId: 'externalId_1',
  externalCreatedAt: baseDateMock,
  externalUpdatedAt: baseDateMock,
  isVisible: true,
};

export const productMock: Product = {
  productId: 1,
  externalId: 'externalId_1',
  sku: 'sku',
  name: 'name',
  brand: 'brand',
  model: 'model',
  category: 'category',
  color: 'color',
  price: 0,
  currency: 'currency',
  stock: 0,
  isVisible: true,
  externalCreatedAt: baseDateMock,
  externalUpdatedAt: baseDateMock,
  createdAt: baseDateMock,
  updatedAt: baseDateMock,
};

export const productCreateMock: ConvertedProduct = {
  ...convertedProductMock,
  externalCreatedAt: baseDateMock,
  externalUpdatedAt: baseDateMock,
};
