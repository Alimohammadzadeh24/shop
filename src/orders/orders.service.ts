import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { OrderModel } from '../domain/order.model';
import { OrderMapper } from '../domain/mappers/order.mapper';
import { OrderStatusEnum } from '../common/enums/order-status.enum';
import { OrdersRepository } from './orders.repository';

/**
 * Service responsible for managing order operations including creation, retrieval,
 * and status updates for customer orders.
 *
 * @class OrdersService
 * @since 1.0.0
 */
@Injectable()
export class OrdersService {
  constructor(private readonly repo: OrdersRepository) {}

  /**
   * Creates a new order with multiple items and shipping information.
   * Calculates total amounts and initializes order with PENDING status.
   *
   * @async
   * @function create
   * @param {CreateOrderDto} dto - Order creation data including items and shipping address
   * @returns {Promise<OrderModel>} The created order model
   * @throws {ValidationException} When order data is invalid
   *
   * @example
   * ```typescript
   * const order = await ordersService.create({
   *   userId: 'user-id-123',
   *   items: [{
   *     productId: 'product-id-456',
   *     quantity: 2,
   *     unitPrice: 299.99
   *   }],
   *   shippingAddress: {
   *     street: '123 Main St',
   *     city: 'New York',
   *     state: 'NY',
   *     zipCode: '10001'
   *   }
   * });
   * console.log(order.id); // Generated order ID
   * ```
   *
   * @since 1.0.0
   */
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

  /**
   * Retrieves orders with optional filtering by user, status, and pagination support.
   *
   * @async
   * @function findAll
   * @param {OrderQueryDto} query - Query parameters for filtering and pagination
   * @returns {Promise<OrderModel[]>} Array of order models matching the criteria
   *
   * @example
   * ```typescript
   * const orders = await ordersService.findAll({
   *   userId: 'user-id-123',
   *   status: OrderStatusEnum.PENDING,
   *   skip: 0,
   *   take: 10
   * });
   * console.log(orders.length); // Number of orders found
   * ```
   *
   * @since 1.0.0
   */
  async findAll(query: OrderQueryDto): Promise<OrderModel[]> {
    return this.repo.findAll(query);
  }

  /**
   * Retrieves an order by its unique identifier, including all order items.
   *
   * @async
   * @function findOne
   * @param {string} id - The unique identifier of the order
   * @returns {Promise<OrderModel | undefined>} The order model if found, undefined otherwise
   *
   * @example
   * ```typescript
   * const order = await ordersService.findOne('order-id-123');
   * if (order) {
   *   console.log(order.totalAmount); // Order total
   *   console.log(order.items.length); // Number of items
   * }
   * ```
   *
   * @since 1.0.0
   */
  async findOne(id: string): Promise<OrderModel | undefined> {
    return this.repo.findById(id);
  }

  /**
   * Updates the status of an existing order (e.g., PENDING -> CONFIRMED -> SHIPPED).
   * Validates status transitions to ensure logical order processing flow.
   *
   * @async
   * @function updateStatus
   * @param {string} id - The unique identifier of the order to update
   * @param {UpdateOrderStatusDto} dto - New status information
   * @returns {Promise<OrderModel | undefined>} The updated order model if found, undefined otherwise
   * @throws {BadRequestException} When status transition is invalid
   *
   * @example
   * ```typescript
   * const updatedOrder = await ordersService.updateStatus('order-id-123', {
   *   status: OrderStatusEnum.SHIPPED
   * });
   * if (updatedOrder) {
   *   console.log(updatedOrder.status); // "SHIPPED"
   * }
   * ```
   *
   * @since 1.0.0
   */
  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderModel | undefined> {
    return this.repo.updateStatus(id, dto.status as unknown as string);
  }
}
