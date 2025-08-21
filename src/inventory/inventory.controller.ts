import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryQueryDto } from './dto/inventory-query.dto';
import { InventoryMapper } from '../domain/mappers/inventory.mapper';
import { InventoryAlertDto } from './dto/inventory-alert.dto';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all inventory items',
    description:
      'Retrieve inventory information for all products with optional filtering for low stock alerts.',
  })
  @ApiQuery({
    name: 'lowStock',
    description: 'Filter for products with low stock (below minimum threshold)',
    required: false,
    type: Boolean,
    example: true,
  })
  @ApiQuery({
    name: 'skip',
    description: 'Number of inventory items to skip for pagination',
    required: false,
    type: Number,
    example: 0,
  })
  @ApiQuery({
    name: 'take',
    description: 'Number of inventory items to return (max 50)',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiOkResponse({
    description: 'Inventory items retrieved successfully',
    type: [InventoryAlertDto],
    example: [
      {
        id: 'clx1b2c3d4e5f6g7h8i9j0k1',
        productId: 'clx1b2c3d4e5f6g7h8i9j0k2',
        productName: 'Wireless Headphones',
        quantity: 25,
        minThreshold: 10,
        isLowStock: false,
        lastUpdated: '2024-01-15T14:30:00Z',
      },
    ],
  })
  async findAll(@Query() query: InventoryQueryDto): Promise<unknown> {
    const models = await this.inventoryService.findAll(query);
    return models.map(InventoryMapper.toAlertDto);
  }

  @Get(':productId')
  @ApiOperation({
    summary: 'Get inventory by product ID',
    description:
      'Retrieve inventory information for a specific product including stock levels and alerts.',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product unique identifier',
    example: 'clx1b2c3d4e5f6g7h8i9j0k1',
  })
  @ApiOkResponse({
    description: 'Inventory item found successfully',
    type: InventoryAlertDto,
    example: {
      id: 'clx1b2c3d4e5f6g7h8i9j0k1',
      productId: 'clx1b2c3d4e5f6g7h8i9j0k2',
      productName: 'Wireless Headphones',
      quantity: 5,
      minThreshold: 10,
      isLowStock: true,
      lastUpdated: '2024-01-15T14:30:00Z',
    },
  })
  @ApiNotFoundResponse({
    description: 'Inventory item not found',
    example: {
      statusCode: 404,
      message: 'Inventory item not found',
      error: 'Not Found',
    },
  })
  async findOne(@Param('productId') productId: string): Promise<unknown> {
    const model = await this.inventoryService.findOne(productId);
    return model ? InventoryMapper.toAlertDto(model) : {};
  }

  @Patch(':productId')
  @ApiOperation({
    summary: 'Update inventory',
    description:
      'Update inventory levels for a specific product including quantity and minimum threshold.',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product unique identifier',
    example: 'clx1b2c3d4e5f6g7h8i9j0k1',
  })
  @ApiBody({
    type: UpdateInventoryDto,
    description: 'Inventory update data',
    examples: {
      updateQuantity: {
        summary: 'Update stock quantity',
        value: {
          quantity: 50,
        },
      },
      updateThreshold: {
        summary: 'Update minimum threshold',
        value: {
          minThreshold: 15,
        },
      },
      fullUpdate: {
        summary: 'Update both quantity and threshold',
        value: {
          quantity: 75,
          minThreshold: 20,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Inventory updated successfully',
    type: InventoryAlertDto,
    example: {
      id: 'clx1b2c3d4e5f6g7h8i9j0k1',
      productId: 'clx1b2c3d4e5f6g7h8i9j0k2',
      productName: 'Wireless Headphones',
      quantity: 75,
      minThreshold: 20,
      isLowStock: false,
      lastUpdated: '2024-01-15T16:45:00Z',
    },
  })
  @ApiNotFoundResponse({
    description: 'Inventory item not found',
    example: {
      statusCode: 404,
      message: 'Inventory item not found',
      error: 'Not Found',
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    example: {
      statusCode: 400,
      message: ['quantity must be a positive number'],
      error: 'Bad Request',
    },
  })
  async update(
    @Param('productId') productId: string,
    @Body() dto: UpdateInventoryDto,
  ): Promise<unknown> {
    const model = await this.inventoryService.update(productId, dto);
    return InventoryMapper.toAlertDto(model);
  }
}
