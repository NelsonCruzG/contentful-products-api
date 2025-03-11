import { Injectable } from '@nestjs/common';
import { ConvertedProduct, ItemWrapper } from './products.types';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private synchronizationsRepo: Repository<Product>,
  ) {}
  convertToProduct(item: ItemWrapper): ConvertedProduct {
    return {
      sku: item.fields.sku,
      name: item.fields.name,
      brand: item.fields.brand,
      model: item.fields.model,
      category: item.fields.category,
      color: item.fields.color,
      price: item.fields.price,
      currency: item.fields.currency,
      stock: item.fields.stock,
      externalId: item.sys.id,
      externalCreatedAt: item.sys.createdAt,
      externalUpdatedAt: item.sys.updatedAt,
      isVisible: true,
    };
  }

  async create(product: ConvertedProduct): Promise<Product> {
    return this.synchronizationsRepo.save(product);
  }

  async createMany(products: ConvertedProduct[]): Promise<Product[]> {
    return this.synchronizationsRepo.save(products);
  }

  async findByExternalId(externalId: string): Promise<Product> {
    return this.synchronizationsRepo.findOneBy({ externalId });
  }

  async update(productId: number, product: ConvertedProduct): Promise<Product> {
    const updatedProduct = await this.synchronizationsRepo.preload({
      productId,
      ...product,
    });
    return this.synchronizationsRepo.save(updatedProduct);
  }

  async removedCount(since?: Date): Promise<number> {
    return this.synchronizationsRepo.count({
      where: { isVisible: false, updatedAt: MoreThan(since) },
    });
  }
}
