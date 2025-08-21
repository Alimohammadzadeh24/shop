import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product unique identifier',
    example: 'clx1b2c3d4e5f6g7h8i9j0k1',
  })
  id!: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Headphones',
  })
  name!: string;

  @ApiProperty({
    description: 'Product description',
    example:
      'High-quality wireless headphones with noise cancellation and 20-hour battery life',
  })
  description!: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 299.99,
  })
  price!: number;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
  })
  category!: string;

  @ApiProperty({
    description: 'Product brand',
    example: 'TechBrand',
  })
  brand!: string;

  @ApiProperty({
    description: 'Array of product image URLs',
    type: [String],
    example: [
      'https://example.com/headphones1.jpg',
      'https://example.com/headphones2.jpg',
    ],
  })
  images!: string[];

  @ApiProperty({
    description: 'Whether the product is active in the catalog',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Product creation timestamp',
    example: '2024-01-15T10:30:00Z',
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Product last update timestamp',
    example: '2024-01-15T14:20:00Z',
    format: 'date-time',
  })
  updatedAt!: Date;
}
