import { Injectable } from '@nestjs/common';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryQueryDto } from './dto/inventory-query.dto';
import { InventoryModel } from '../domain/inventory.model';
import { InventoryRepository } from './inventory.repository';

@Injectable()
export class InventoryService {
  constructor(private readonly repo: InventoryRepository) {}

  async findAll(query: InventoryQueryDto): Promise<InventoryModel[]> {
    return this.repo.findAll(query);
  }

  async findOne(productId: string): Promise<InventoryModel | undefined> {
    return this.repo.findByProductId(productId);
  }

  async update(
    productId: string,
    dto: UpdateInventoryDto,
  ): Promise<InventoryModel> {
    return this.repo.upsert(productId, {
      quantity: dto.quantity,
      minThreshold: dto.minThreshold,
    });
  }
}
