import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Headphones',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Detailed product description',
    example:
      'High-quality wireless headphones with noise cancellation and 20-hour battery life',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  description!: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 299.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
  })
  @IsString()
  category!: string;

  @ApiProperty({
    description: 'Product brand',
    example: 'TechBrand',
  })
  @IsString()
  brand!: string;

  @ApiProperty({
    description: 'Array of product image URLs',
    type: [String],
    example: [
      'https://example.com/headphones1.jpg',
      'https://example.com/headphones2.jpg',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  images!: string[];

  @ApiProperty({
    description: 'Whether the product is active in the catalog',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
