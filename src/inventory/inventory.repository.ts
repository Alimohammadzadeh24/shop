import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryModel } from '../domain/inventory.model';
import { InventoryQueryDto } from './dto/inventory-query.dto';

function mapDbToModel(row: any): InventoryModel {
  return {
    id: row.id,
    productId: row.productId,
    quantity: row.quantity,
    minThreshold: row.minThreshold,
    lastUpdated: row.lastUpdated,
  };
}

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: InventoryQueryDto): Promise<InventoryModel[]> {
    const rows = await this.prisma.inventory.findMany({
      skip: query.skip,
      take: query.take,
      orderBy: { lastUpdated: 'desc' },
    });
    return rows.map(mapDbToModel);
  }

  async findByProductId(productId: string): Promise<InventoryModel | undefined> {
    const row = await this.prisma.inventory.findUnique({ where: { productId } });
    return row ? mapDbToModel(row) : undefined;
  }

  async upsert(productId: string, data: { quantity: number; minThreshold?: number }): Promise<InventoryModel> {
    const updated = await this.prisma.inventory.upsert({
      where: { productId },
      update: {
        quantity: data.quantity,
        minThreshold: data.minThreshold ?? undefined,
      },
      create: {
        productId,
        quantity: data.quantity,
        minThreshold: data.minThreshold ?? 0,
      },
    });
    return mapDbToModel(updated);
  }
}


