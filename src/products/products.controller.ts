import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductsGetQueryDto } from './dto/products-get-query.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() filterQueryDto: ProductsGetQueryDto) {
    return this.productsService.findAll(filterQueryDto);
  }

  @Delete(':id')
  remove(@Param('id') productId: number) {
    return this.productsService.delete(productId);
  }
}
