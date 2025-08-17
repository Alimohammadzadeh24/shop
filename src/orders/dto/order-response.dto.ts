import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusEnum } from '../../common/enums/order-status.enum';

export class OrderResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: OrderStatusEnum })
  status!: OrderStatusEnum;

  @ApiProperty()
  totalAmount!: number;

  @ApiProperty({ type: Object })
  shippingAddress!: Record<string, unknown>;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
