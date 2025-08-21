import { OrderStatusEnum } from '../common/enums/order-status.enum';

export class OrderItemModel {
  id!: string;
  orderId!: string;
  productId!: string;
  quantity!: number;
  unitPrice!: number;
  totalPrice!: number;
}

export class OrderModel {
  id!: string;
  userId!: string;
  status!: OrderStatusEnum;
  totalAmount!: number;
  shippingAddress!: Record<string, unknown>;
  createdAt!: Date;
  updatedAt!: Date;
  items!: OrderItemModel[];
}


