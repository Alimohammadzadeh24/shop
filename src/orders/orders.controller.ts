import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() _dto: CreateOrderDto): Promise<unknown> {
    return Promise.resolve({});
  }

  @Get()
  findAll(@Query() _query: OrderQueryDto): Promise<unknown> {
    return Promise.resolve({});
  }

  @Get(':id')
  findOne(@Param('id') _id: string): Promise<unknown> {
    return Promise.resolve({});
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') _id: string,
    @Body() _dto: UpdateOrderStatusDto,
  ): Promise<unknown> {
    return Promise.resolve({});
  }
}
