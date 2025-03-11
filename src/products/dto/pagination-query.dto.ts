import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @ApiPropertyOptional({ description: 'The page number' })
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  @ApiPropertyOptional({ description: 'The page size' })
  limit?: number = 5;
}
