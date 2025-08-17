import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryQueryDto } from './dto/inventory-query.dto';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll(@Query() _query: InventoryQueryDto): Promise<unknown> {
    return Promise.resolve({});
  }

  @Get(':productId')
  findOne(@Param('productId') _productId: string): Promise<unknown> {
    return Promise.resolve({});
  }

  @Patch(':productId')
  update(
    @Param('productId') _productId: string,
    @Body() _dto: UpdateInventoryDto,
  ): Promise<unknown> {
    return Promise.resolve({});
  }
}
