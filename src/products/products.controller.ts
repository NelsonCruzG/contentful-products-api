import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductsGetQueryDto } from './dto/products-get-query.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Returns an object with an array of products and pagination data',
  })
  @ApiBadRequestResponse({
    description:
      'Error on query parameters, returns a message with the error(s)',
  })
  findAll(@Query() filterQueryDto: ProductsGetQueryDto) {
    return this.productsService.findAll(filterQueryDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Product removed successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  remove(@Param('id') productId: number) {
    return this.productsService.delete(productId);
  }
}
