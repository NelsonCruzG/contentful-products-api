import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { PaginationQueryDto } from './pagination-query.dto';

export class ProductsGetQueryDto extends PartialType(PaginationQueryDto) {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  @ApiPropertyOptional({ description: 'The product external sku' })
  readonly sku: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  @ApiPropertyOptional({ description: 'The product name' })
  readonly name: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  @ApiPropertyOptional({ description: 'The product brand' })
  readonly brand: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  @ApiPropertyOptional({ description: 'The product model' })
  readonly model: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  @ApiPropertyOptional({ description: 'The product category' })
  readonly category: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  @ApiPropertyOptional({ description: 'The product color' })
  readonly color: string;

  @IsOptional()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiPropertyOptional({ description: 'The product min price' })
  readonly minPrice?: number = 1;

  @IsOptional()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiPropertyOptional({ description: 'The product max price' })
  readonly maxPrice?: number = 100_000_000;
}
