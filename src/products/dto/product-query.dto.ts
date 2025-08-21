import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ProductQueryDto {
  @ApiPropertyOptional({
    description: 'Search term to filter products by name or description',
    example: 'wireless headphones',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter products by category',
    example: 'Electronics',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter products by brand',
    example: 'TechBrand',
  })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Number of products to skip for pagination',
    example: 0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  skip?: number;

  @ApiPropertyOptional({
    description: 'Number of products to return (maximum 50)',
    example: 10,
    minimum: 1,
    maximum: 50,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  take?: number;
}
