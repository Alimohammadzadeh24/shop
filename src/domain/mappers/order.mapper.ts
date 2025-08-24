import { OrderModel, OrderItemModel } from '../order.model';
import { CreateOrderDto } from '../../orders/dto/create-order.dto';
import { OrderResponseDto } from '../../orders/dto/order-response.dto';
import { OrderStatusEnum } from '../../common/enums/order-status.enum';

export class OrderMapper {
  static fromCreateDto(dto: CreateOrderDto, userId: string): OrderModel {
    const now = new Date();
    const items: OrderItemModel[] = dto.items.map((i) => ({
      id: '',
      orderId: '',
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      totalPrice: Number((i.unitPrice * i.quantity).toFixed(2)),
    }));
    return {
      id: '',
      userId,
      status: OrderStatusEnum.PENDING,
      totalAmount: dto.totalAmount,
      shippingAddress: dto.shippingAddress,
      createdAt: now,
      updatedAt: now,
      items,
    };
  }

  static toResponseDto(model: OrderModel): OrderResponseDto {
    return {
      id: model.id,
      userId: model.userId,
      status: model.status,
      totalAmount: model.totalAmount,
      shippingAddress: model.shippingAddress,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }
}
