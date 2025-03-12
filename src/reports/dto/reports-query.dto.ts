import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class ReportsGetQueryDto {
  @IsOptional()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiPropertyOptional({ description: 'The product min price range' })
  readonly minPrice?: number = 1;

  @IsOptional()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiPropertyOptional({ description: 'The product max price range' })
  readonly maxPrice?: number = 100_000_000;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'The start date range' })
  readonly startDate?: Date = new Date(0);

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'The end date range' })
  readonly endDate?: Date = new Date('9999-12-31');
}
