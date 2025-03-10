import { Injectable } from '@nestjs/common';
import { ConvertedProduct, ItemWrapper } from './products.types';

@Injectable()
export class ProductsService {
  convertToProduct(
    item: ItemWrapper,
    isVisible: boolean = true,
  ): ConvertedProduct {
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
      extrernalId: item.sys.id,
      externalCreatedAt: item.sys.createdAt,
      externalUpdatedAt: item.sys.updatedAt,
      isVisible: isVisible,
    };
  }
}
