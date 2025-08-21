import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Premium Wireless Headphones',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example:
      'Enhanced wireless headphones with premium features and extended battery life',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Product price in USD',
    example: 249.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'Premium Electronics',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Product brand',
    example: 'TechBrand Pro',
  })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Array of product image URLs',
    type: [String],
    example: [
      'https://example.com/headphones-updated1.jpg',
      'https://example.com/headphones-updated2.jpg',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({
    description: 'Whether the product is active in the catalog',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
