import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { OrderModel } from '../domain/order.model';
import { OrderMapper } from '../domain/mappers/order.mapper';
import { OrderStatusEnum } from '../common/enums/order-status.enum';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly repo: OrdersRepository) {}

  async create(dto: CreateOrderDto): Promise<OrderModel> {
    const model = OrderMapper.fromCreateDto(dto);
    return this.repo.create({
      userId: model.userId,
      totalAmount: model.totalAmount,
      shippingAddress: model.shippingAddress,
      items: model.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice,
      })),
    });
  }

  async findAll(query: OrderQueryDto): Promise<OrderModel[]> {
    return this.repo.findAll(query);
  }

  async findOne(id: string): Promise<OrderModel | undefined> {
    return this.repo.findById(id);
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderModel | undefined> {
    return this.repo.updateStatus(id, dto.status as unknown as string);
  }
}
