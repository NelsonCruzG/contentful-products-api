import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ConvertedProduct,
  ItemWrapper,
  ProductsResponse,
} from './products.types';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, MoreThan, Repository } from 'typeorm';
import { ProductsGetQueryDto } from './dto/products-get-query.dto';

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

  async findAll(filterDto: ProductsGetQueryDto): Promise<ProductsResponse> {
    const { limit, page, ...query } = filterDto;
    const { minPrice, maxPrice, name, ...rest } = query;
    const filter = {
      ...rest,
      price: Between(minPrice, maxPrice),
      name: Like(`%${name || ''}%`),
      isVisible: true,
    };

    const result = await this.synchronizationsRepo.find({
      take: limit,
      skip: (page - 1) * limit,
      where: filter,
      order: { productId: 'ASC' },
    });

    const count = await this.synchronizationsRepo.count({
      where: { ...filter, isVisible: true },
    });
    const hasNextPage = count > page * limit;

    return {
      items: result,
      page: page,
      limit,
      total: count,
      hasMore: hasNextPage,
    };
  }

  async findById(productId: number): Promise<Product> {
    const product = await this.synchronizationsRepo.findOneBy({
      productId,
      isVisible: true,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async delete(productId: number): Promise<void> {
    await this.findById(productId);
    await this.synchronizationsRepo.update({ productId }, { isVisible: false });
  }
}
