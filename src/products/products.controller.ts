import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductMapper } from '../domain/mappers/product.mapper';
import { ProductResponseDto } from './dto/product-response.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new product',
    description:
      'Add a new product to the catalog with detailed information and images.',
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'Product creation data',
    examples: {
      electronics: {
        summary: 'Electronics product',
        value: {
          name: 'Wireless Headphones',
          description:
            'High-quality wireless headphones with noise cancellation',
          price: 299.99,
          category: 'Electronics',
          brand: 'TechBrand',
          images: [
            'https://example.com/headphones1.jpg',
            'https://example.com/headphones2.jpg',
          ],
          isActive: true,
        },
      },
      clothing: {
        summary: 'Clothing product',
        value: {
          name: 'Cotton T-Shirt',
          description:
            'Comfortable 100% cotton t-shirt available in multiple colors',
          price: 29.99,
          category: 'Clothing',
          brand: 'FashionBrand',
          images: ['https://example.com/tshirt1.jpg'],
          isActive: true,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    example: {
      statusCode: 400,
      message: [
        'name should not be empty',
        'price must be a positive number',
        'images should not be empty',
      ],
      error: 'Bad Request',
    },
  })
  async create(@Body() dto: CreateProductDto): Promise<unknown> {
    const model = await this.productsService.create(dto);
    return ProductMapper.toResponseDto(model);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Retrieve products with optional filtering by search term, category, and brand. Supports pagination.',
  })
  @ApiQuery({
    name: 'search',
    description: 'Search term to filter products by name or description',
    required: false,
    example: 'wireless headphones',
  })
  @ApiQuery({
    name: 'category',
    description: 'Filter products by category',
    required: false,
    example: 'Electronics',
  })
  @ApiQuery({
    name: 'brand',
    description: 'Filter products by brand',
    required: false,
    example: 'TechBrand',
  })
  @ApiQuery({
    name: 'skip',
    description: 'Number of products to skip for pagination',
    required: false,
    type: Number,
    example: 0,
  })
  @ApiQuery({
    name: 'take',
    description: 'Number of products to return (max 50)',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiOkResponse({
    description: 'Products retrieved successfully',
    type: [ProductResponseDto],
    example: [
      {
        id: 'clx1b2c3d4e5f6g7h8i9j0k1',
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 299.99,
        category: 'Electronics',
        brand: 'TechBrand',
        images: ['https://example.com/headphones1.jpg'],
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
    ],
  })
  async findAll(@Query() query: ProductQueryDto): Promise<unknown> {
    const models = await this.productsService.findAll(query);
    return models.map(ProductMapper.toResponseDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve a specific product by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product unique identifier',
    example: 'clx1b2c3d4e5f6g7h8i9j0k1',
  })
  @ApiOkResponse({
    description: 'Product found successfully',
    type: ProductResponseDto,
    example: {
      id: 'clx1b2c3d4e5f6g7h8i9j0k1',
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 299.99,
      category: 'Electronics',
      brand: 'TechBrand',
      images: [
        'https://example.com/headphones1.jpg',
        'https://example.com/headphones2.jpg',
      ],
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    example: {
      statusCode: 404,
      message: 'Product not found',
      error: 'Not Found',
    },
  })
  async findOne(@Param('id') id: string): Promise<unknown> {
    const model = await this.productsService.findOne(id);
    return model ? ProductMapper.toResponseDto(model) : {};
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update product',
    description:
      'Update product information. Only provided fields will be updated.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product unique identifier',
    example: 'clx1b2c3d4e5f6g7h8i9j0k1',
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Product update data (all fields optional)',
    examples: {
      updatePrice: {
        summary: 'Update product price',
        value: {
          price: 249.99,
        },
      },
      updateInfo: {
        summary: 'Update product information',
        value: {
          name: 'Premium Wireless Headphones',
          description: 'Enhanced wireless headphones with premium features',
        },
      },
      deactivateProduct: {
        summary: 'Deactivate product',
        value: {
          isActive: false,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Product updated successfully',
    type: ProductResponseDto,
    example: {
      id: 'clx1b2c3d4e5f6g7h8i9j0k1',
      name: 'Premium Wireless Headphones',
      description: 'Enhanced wireless headphones with premium features',
      price: 249.99,
      category: 'Electronics',
      brand: 'TechBrand',
      images: ['https://example.com/headphones1.jpg'],
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
    },
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    example: {
      statusCode: 404,
      message: 'Product not found',
      error: 'Not Found',
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    example: {
      statusCode: 400,
      message: ['price must be a positive number'],
      error: 'Bad Request',
    },
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<unknown> {
    const model = await this.productsService.update(id, dto);
    return model ? ProductMapper.toResponseDto(model) : {};
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete product',
    description:
      'Permanently delete a product from the catalog. This action cannot be undone.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product unique identifier',
    example: 'clx1b2c3d4e5f6g7h8i9j0k1',
  })
  @ApiOkResponse({
    description: 'Product deleted successfully',
    schema: {
      type: 'object',
      properties: { success: { type: 'boolean' } },
      example: { success: true },
    },
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    example: {
      statusCode: 404,
      message: 'Product not found',
      error: 'Not Found',
    },
  })
  async remove(@Param('id') id: string): Promise<unknown> {
    const ok = await this.productsService.remove(id);
    return { success: ok };
  }
}
