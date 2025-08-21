import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { OrderMapper } from '../domain/mappers/order.mapper';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiCreatedResponse({ type: OrderResponseDto })
  async create(@Body() dto: CreateOrderDto): Promise<unknown> {
    const model = await this.ordersService.create(dto);
    return OrderMapper.toResponseDto(model);
  }

  @Get()
  @ApiOkResponse({ type: [OrderResponseDto] })
  async findAll(@Query() query: OrderQueryDto): Promise<unknown> {
    const models = await this.ordersService.findAll(query);
    return models.map(OrderMapper.toResponseDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: OrderResponseDto })
  async findOne(@Param('id') id: string): Promise<unknown> {
    const model = await this.ordersService.findOne(id);
    return model ? OrderMapper.toResponseDto(model) : {};
  }

  @Patch(':id/status')
  @ApiOkResponse({ type: OrderResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<unknown> {
    const model = await this.ordersService.updateStatus(id, dto);
    return model ? OrderMapper.toResponseDto(model) : {};
  }
}
