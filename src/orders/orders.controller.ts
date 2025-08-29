import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { MyOrdersQueryDto } from './dto/my-orders-query.dto';
import { OrderMapper } from '../domain/mappers/order.mapper';
import { OrderResponseDto } from './dto/order-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new order',
    description:
      'Create a new order with multiple items and shipping information.',
  })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Order creation data',
    examples: {
      singleItem: {
        summary: 'Single item order',
        value: {
          items: [
            {
              productId: 'clx1b2c3d4e5f6g7h8i9j0k2',
              quantity: 2,
              unitPrice: 299.99,
            },
          ],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
          },
        },
      },
      multipleItems: {
        summary: 'Multiple items order',
        value: {
          items: [
            {
              productId: 'clx1b2c3d4e5f6g7h8i9j0k2',
              quantity: 1,
              unitPrice: 299.99,
            },
            {
              productId: 'clx1b2c3d4e5f6g7h8i9j0k3',
              quantity: 3,
              unitPrice: 29.99,
            },
          ],
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'USA',
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    example: {
      statusCode: 400,
      message: ['items should not be empty', 'shippingAddress is required'],
      error: 'Bad Request',
    },
  })
  async create(
    @User('sub') userId: string,
    @Body() dto: CreateOrderDto,
  ): Promise<unknown> {
    const model = await this.ordersService.create(userId, dto);
    return OrderMapper.toResponseDto(model);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all orders (Admin only)',
    description:
      'Retrieve all orders with optional filtering by user, status, and date range. Supports pagination.',
  })
  @ApiQuery({
    name: 'userId',
    description: 'Filter orders by user ID',
    required: false,
    example: 'clx1b2c3d4e5f6g7h8i9j0k1',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filter orders by status',
    required: false,
    example: 'PENDING',
  })
  @ApiQuery({
    name: 'skip',
    description: 'Number of orders to skip for pagination',
    required: false,
    type: Number,
    example: 0,
  })
  @ApiQuery({
    name: 'take',
    description: 'Number of orders to return (max 50)',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiOkResponse({
    description: 'Orders retrieved successfully',
    type: [OrderResponseDto],
  })
  async findAll(@Query() query: OrderQueryDto): Promise<unknown> {
    const models = await this.ordersService.findAll(query);
    return models.map(OrderMapper.toResponseDto);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user orders',
    description:
      'Retrieve orders for the currently authenticated user with optional filtering by status and pagination.',
  })
  @ApiQuery({
    name: 'status',
    description: 'Filter orders by status',
    required: false,
    example: 'PENDING',
  })
  @ApiQuery({
    name: 'skip',
    description: 'Number of orders to skip for pagination',
    required: false,
    type: Number,
    example: 0,
  })
  @ApiQuery({
    name: 'take',
    description: 'Number of orders to return (max 50)',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiOkResponse({
    description: 'User orders retrieved successfully',
    type: [OrderResponseDto],
  })
  async getMyOrders(
    @User('sub') userId: string,
    @Query() query: MyOrdersQueryDto,
  ): Promise<unknown> {
    // Create the full query with userId from token
    const fullQuery: OrderQueryDto = { ...query, userId };
    const models = await this.ordersService.findAll(fullQuery);

    return models.map(OrderMapper.toResponseDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get order by ID',
    description:
      'Retrieve a specific order by its unique identifier, including all order items.',
  })
  @ApiParam({
    name: 'id',
    description: 'Order unique identifier',
    example: 'clx1b2c3d4e5f6g7h8i9j0k1',
  })
  @ApiOkResponse({
    description: 'Order found successfully',
    type: OrderResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
    example: {
      statusCode: 404,
      message: 'Order not found',
      error: 'Not Found',
    },
  })
  async findOne(@Param('id') id: string): Promise<unknown> {
    const model = await this.ordersService.findOne(id);
    return model ? OrderMapper.toResponseDto(model) : {};
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update order status',
    description:
      'Update the status of an existing order (e.g., from PENDING to CONFIRMED).',
  })
  @ApiParam({
    name: 'id',
    description: 'Order unique identifier',
    example: 'clx1b2c3d4e5f6g7h8i9j0k1',
  })
  @ApiBody({
    type: UpdateOrderStatusDto,
    description: 'New order status',
    examples: {
      confirm: {
        summary: 'Confirm order',
        value: {
          status: 'CONFIRMED',
        },
      },
      ship: {
        summary: 'Mark as shipped',
        value: {
          status: 'SHIPPED',
        },
      },
      deliver: {
        summary: 'Mark as delivered',
        value: {
          status: 'DELIVERED',
        },
      },
      cancel: {
        summary: 'Cancel order',
        value: {
          status: 'CANCELLED',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Order status updated successfully',
    type: OrderResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
    example: {
      statusCode: 404,
      message: 'Order not found',
      error: 'Not Found',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid status transition',
    example: {
      statusCode: 400,
      message: 'Invalid status transition',
      error: 'Bad Request',
    },
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<unknown> {
    const model = await this.ordersService.updateStatus(id, dto);
    return model ? OrderMapper.toResponseDto(model) : {};
  }
}
