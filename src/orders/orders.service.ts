import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';

@Injectable()
export class OrdersService {
  async create(_dto: CreateOrderDto): Promise<unknown> {
    return {};
  }

  async findAll(_query: OrderQueryDto): Promise<unknown> {
    return {};
  }

  async findOne(_id: string): Promise<unknown> {
    return {};
  }

  async updateStatus(
    _id: string,
    _dto: UpdateOrderStatusDto,
  ): Promise<unknown> {
    return {};
  }
}
