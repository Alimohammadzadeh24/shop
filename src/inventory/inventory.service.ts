import { Injectable } from '@nestjs/common';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryQueryDto } from './dto/inventory-query.dto';

@Injectable()
export class InventoryService {
  async findAll(_query: InventoryQueryDto): Promise<unknown> {
    return {};
  }

  async findOne(_productId: string): Promise<unknown> {
    return {};
  }

  async update(_productId: string, _dto: UpdateInventoryDto): Promise<unknown> {
    return {};
  }
}
