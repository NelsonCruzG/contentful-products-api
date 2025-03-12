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
import { ReportsGetQueryDto } from '../reports/dto/reports-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
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
    return this.productsRepo.save(product);
  }

  async createMany(products: ConvertedProduct[]): Promise<Product[]> {
    return this.productsRepo.save(products);
  }

  async findByExternalId(externalId: string): Promise<Product> {
    return this.productsRepo.findOneBy({ externalId });
  }

  async update(productId: number, product: ConvertedProduct): Promise<Product> {
    const updatedProduct = await this.productsRepo.preload({
      productId,
      ...product,
    });
    return this.productsRepo.save(updatedProduct);
  }

  async removedCount(since?: Date): Promise<number> {
    return this.productsRepo.count({
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

    const result = await this.productsRepo.find({
      take: limit,
      skip: (page - 1) * limit,
      where: filter,
      order: { productId: 'ASC' },
    });

    const count = await this.productsRepo.count({
      where: filter,
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
    const product = await this.productsRepo.findOneBy({
      productId,
      isVisible: true,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async delete(productId: number): Promise<void> {
    await this.findById(productId);
    await this.productsRepo.update({ productId }, { isVisible: false });
  }

  async totalCount(): Promise<number> {
    return this.productsRepo.count();
  }

  async totalDeletedCount(filterDto: ReportsGetQueryDto): Promise<number> {
    const { minPrice, maxPrice, startDate, endDate } = filterDto;
    const filter = {
      price: Between(minPrice, maxPrice),
      updatedAt: Between(startDate, endDate),
      isVisible: false,
    };

    return this.productsRepo.count({ where: filter });
  }
}
