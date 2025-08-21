import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReturnModel } from '../domain/return.model';
import { ReturnQueryDto } from './dto/return-query.dto';

function mapDbToModel(row: any): ReturnModel {
  return {
    id: row.id,
    orderId: row.orderId,
    userId: row.userId,
    reason: row.reason,
    status: row.status,
    refundAmount: Number(row.refundAmount),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

@Injectable()
export class ReturnsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<ReturnModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReturnModel> {
    const created = await this.prisma.return.create({
      data,
    });
    return mapDbToModel(created);
  }

  async findAll(query: ReturnQueryDto): Promise<ReturnModel[]> {
    const rows = await this.prisma.return.findMany({
      skip: query.skip,
      take: query.take,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(mapDbToModel);
  }

  async findById(id: string): Promise<ReturnModel | undefined> {
    const row = await this.prisma.return.findUnique({ where: { id } });
    return row ? mapDbToModel(row) : undefined;
  }

  async updateStatus(id: string, status: string): Promise<ReturnModel | undefined> {
    const updated = await this.prisma.return.update({ where: { id }, data: { status: status as any } });
    return updated ? mapDbToModel(updated) : undefined;
  }
}


