import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOkResponse({ type: [InventoryAlertDto] })
  async findAll(@Query() query: InventoryQueryDto): Promise<unknown> {
    const models = await this.inventoryService.findAll(query);
    return models.map(InventoryMapper.toAlertDto);
  }

  @Get(':productId')
  @ApiOkResponse({ type: InventoryAlertDto })
  async findOne(@Param('productId') productId: string): Promise<unknown> {
    const model = await this.inventoryService.findOne(productId);
    return model ? InventoryMapper.toAlertDto(model) : {};
  }

  @Patch(':productId')
  @ApiOkResponse({ type: InventoryAlertDto })
  async update(
    @Param('productId') productId: string,
    @Body() dto: UpdateInventoryDto,
  ): Promise<unknown> {
    const model = await this.inventoryService.update(productId, dto);
    return InventoryMapper.toAlertDto(model);
  }
}
