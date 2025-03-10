import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/product.entity';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],
  providers: [ProductsService],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
