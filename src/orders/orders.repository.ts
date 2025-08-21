import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderItemModel, OrderModel } from '../domain/order.model';
import { OrderQueryDto } from './dto/order-query.dto';

function mapItem(row: any): OrderItemModel {
  return {
    id: row.id,
    orderId: row.orderId,
    productId: row.productId,
    quantity: row.quantity,
    unitPrice: Number(row.unitPrice),
    totalPrice: Number(row.totalPrice),
  };
}

function mapOrder(row: any): OrderModel {
  return {
    id: row.id,
    userId: row.userId,
    status: row.status,
    totalAmount: Number(row.totalAmount),
    shippingAddress: row.shippingAddress as Record<string, unknown>,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    items: (row.items ?? []).map(mapItem),
  };
}

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    totalAmount: number;
    shippingAddress: Record<string, unknown>;
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
  }): Promise<OrderModel> {
    const created = await this.prisma.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        shippingAddress: data.shippingAddress as any,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.totalPrice,
          })),
        },
      },
      include: { items: true },
    });
    return mapOrder(created);
  }

  async findAll(query: OrderQueryDto): Promise<OrderModel[]> {
    const where: any = {};
    if (query.userId) where.userId = query.userId;
    if (query.status) where.status = query.status;
    const rows = await this.prisma.order.findMany({
      where,
      skip: query.skip,
      take: query.take,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
    return rows.map(mapOrder);
  }

  async findById(id: string): Promise<OrderModel | undefined> {
    const row = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    return row ? mapOrder(row) : undefined;
  }

  async updateStatus(id: string, status: string): Promise<OrderModel | undefined> {
    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: { items: true },
    });
    return updated ? mapOrder(updated) : undefined;
  }
}


