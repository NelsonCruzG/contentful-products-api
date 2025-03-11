import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ConvertedProduct,
  ItemWrapper,
  ProductsResponse,
} from './products.types';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { ProductsGetQueryDto } from './dto/products-get-query.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

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
    const { limit, page: offset, ...query } = filterDto;

    const result = await this.synchronizationsRepo.find({
      take: limit,
      skip: (offset - 1) * limit,
      where: { ...query, isVisible: true },
      order: { productId: 'ASC' },
    });

    const count = await this.synchronizationsRepo.count({
      where: { ...query, isVisible: true },
    });
    const hasNextPage = count > offset * limit;

    return {
      items: result,
      page: offset,
      limit,
      total: count,
      hasMore: hasNextPage,
    };
  }

  async findById(productId: number): Promise<Product> {
    const product = await this.synchronizationsRepo.findOneBy({ productId });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async delete(productId: number): Promise<void> {
    await this.findById(productId);
    await this.synchronizationsRepo.update({ productId }, { isVisible: false });
  }
}
